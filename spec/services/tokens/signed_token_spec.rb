require 'rails_helper'

RSpec.describe Tokens::SignedToken do
  include ActiveSupport::Testing::TimeHelpers

  let(:payload) { { user_id: 1, role: 'admin' } }
  let(:purpose) { 'test.purpose.v1' }

  describe '.encode' do
    context 'with valid arguments' do
      it 'returns a non-blank string token' do
        token = described_class.encode(payload, purpose: purpose)

        expect(token).to be_a(String)
        expect(token).not_to be_blank
      end

      it 'returns different tokens for different payloads' do
        token_a = described_class.encode({ id: 1 }, purpose: purpose)
        token_b = described_class.encode({ id: 2 }, purpose: purpose)

        expect(token_a).not_to eq(token_b)
      end

      it 'returns different tokens for different purposes' do
        token_a = described_class.encode(payload, purpose: 'purpose.a')
        token_b = described_class.encode(payload, purpose: 'purpose.b')

        expect(token_a).not_to eq(token_b)
      end
    end

    context 'when purpose is nil' do
      it 'raises ArgumentError' do
        expect { described_class.encode(payload, purpose: nil) }
          .to raise_error(ArgumentError, 'purpose is required')
      end
    end

    context 'when purpose is an empty string' do
      it 'raises ArgumentError' do
        expect { described_class.encode(payload, purpose: '') }
          .to raise_error(ArgumentError, 'purpose is required')
      end
    end

    context 'when purpose is a whitespace-only string' do
      it 'raises ArgumentError' do
        expect { described_class.encode(payload, purpose: '   ') }
          .to raise_error(ArgumentError, 'purpose is required')
      end
    end

    context 'when payload is not a Hash' do
      it 'raises ArgumentError for a String' do
        expect { described_class.encode('not a hash', purpose: purpose) }
          .to raise_error(ArgumentError, 'payload must be a Hash')
      end

      it 'raises ArgumentError for an Array' do
        expect { described_class.encode([1, 2], purpose: purpose) }
          .to raise_error(ArgumentError, 'payload must be a Hash')
      end

      it 'raises ArgumentError for nil' do
        expect { described_class.encode(nil, purpose: purpose) }
          .to raise_error(ArgumentError, 'payload must be a Hash')
      end
    end
  end

  describe '.decode' do
    context 'with a valid token and matching purpose' do
      it 'returns the original payload as HashWithIndifferentAccess' do
        token = described_class.encode(payload, purpose: purpose)

        result = described_class.decode(token, purpose: purpose)

        expect(result).to be_a(ActiveSupport::HashWithIndifferentAccess)
        expect(result[:user_id]).to eq(1)
        expect(result[:role]).to eq('admin')
      end
    end

    context 'when purpose does not match' do
      it 'returns nil' do
        token = described_class.encode(payload, purpose: 'original.purpose')

        result = described_class.decode(token, purpose: 'different.purpose')

        expect(result).to be_nil
      end
    end

    context 'when token is blank' do
      it 'returns nil for nil token' do
        expect(described_class.decode(nil, purpose: purpose)).to be_nil
      end

      it 'returns nil for empty string token' do
        expect(described_class.decode('', purpose: purpose)).to be_nil
      end
    end

    context 'when purpose is nil' do
      it 'raises an error' do
        token = described_class.encode(payload, purpose: purpose)

        expect { described_class.decode(token, purpose: nil) }.to raise_error(ArgumentError)
      end
    end

    context 'when token is garbage' do
      it 'returns nil' do
        expect(described_class.decode('totally-invalid-token', purpose: purpose)).to be_nil
      end
    end

    context 'when token has been tampered with' do
      it 'returns nil' do
        token = described_class.encode(payload, purpose: purpose)
        tampered = token.reverse

        expect(described_class.decode(tampered, purpose: purpose)).to be_nil
      end
    end

    context 'when token has expired' do
      it 'returns nil' do
        token = described_class.encode(payload, purpose: purpose, expires_in: 0.seconds)

        travel 1.second do
          expect(described_class.decode(token, purpose: purpose)).to be_nil
        end
      end
    end

    context 'with custom expires_in' do
      it 'decodes successfully within TTL' do
        token = described_class.encode(payload, purpose: purpose, expires_in: 1.hour)

        travel 30.minutes do
          result = described_class.decode(token, purpose: purpose)

          expect(result[:user_id]).to eq(1)
        end
      end

      it 'returns nil after TTL' do
        token = described_class.encode(payload, purpose: purpose, expires_in: 1.hour)

        travel 2.hours do
          expect(described_class.decode(token, purpose: purpose)).to be_nil
        end
      end
    end
  end
end
