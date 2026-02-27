# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SignedLinks::ResponseFlowBuilder do
  include ActiveSupport::Testing::TimeHelpers

  let(:user) { create(:user) }
  let(:time_period) { create(:time_period) }

  describe '.url' do
    subject(:url) { described_class.url(user, time_period, **options) }

    let(:options) { {} }

    it 'returns a URL string' do
      expect(url).to be_a(String)
    end

    it 'includes response_flow_from_email path' do
      expect(url).to include('/api/v1/response_flow_from_email')
    end

    it 'includes only token in query string' do
      uri = URI.parse(url)
      params = Rack::Utils.parse_query(uri.query)

      expect(params.keys).to eq(['token'])
      expect(params['token']).not_to be_blank
    end

    it 'generates a token that verifies to payload with user_id and time_period_id' do
      token = Rack::Utils.parse_query(URI.parse(url).query)['token']
      payload = described_class.verify(token)

      expect(payload).to be_present
      expect(payload[:user_id]).to eq(user.id)
      expect(payload[:time_period_id]).to eq(time_period.id)
    end

    context 'with options last_step and not_working' do
      let(:options) { { last_step: 'results', not_working: true } }

      it 'encodes options in payload' do
        token = Rack::Utils.parse_query(URI.parse(url).query)['token']
        payload = described_class.verify(token)

        expect(payload[:last_step]).to eq('results')
        expect(payload[:not_working]).to be true
      end
    end

    context 'with emotion_id' do
      let(:emotion) { create(:emotion) }
      let(:options) { { emotion_id: emotion.id } }

      it 'encodes emotion_id in payload' do
        token = Rack::Utils.parse_query(URI.parse(url).query)['token']
        payload = described_class.verify(token)

        expect(payload[:emotion_id]).to eq(emotion.id)
      end
    end
  end

  describe '.url_for_emotion' do
    let(:emotion) { create(:emotion) }

    subject(:url) { described_class.url_for_emotion(user, time_period, emotion.id) }

    it 'returns URL with token that includes emotion_id in payload' do
      payload = described_class.verify(Rack::Utils.parse_query(URI.parse(url).query)['token'])

      expect(payload[:emotion_id]).to eq(emotion.id)
      expect(payload[:user_id]).to eq(user.id)
      expect(payload[:time_period_id]).to eq(time_period.id)
    end
  end

  describe '.verify' do
    context 'with valid token' do
      it 'returns payload' do
        url = described_class.url(user, time_period)
        token = Rack::Utils.parse_query(URI.parse(url).query)['token']

        expect(described_class.verify(token)).to include(user_id: user.id, time_period_id: time_period.id)
      end
    end

    context 'with nil token' do
      it 'returns nil' do
        expect(described_class.verify(nil)).to be_nil
      end
    end

    context 'with wrong purpose token' do
      it 'returns nil' do
        other_token = Tokens::SignedToken.encode({ user_id: user.id }, purpose: 'other.v1')

        expect(described_class.verify(other_token)).to be_nil
      end
    end

    context 'with expired token' do
      it 'returns nil' do
        url = described_class.url(user, time_period)
        token = Rack::Utils.parse_query(URI.parse(url).query)['token']

        travel(8.days) do
          expect(described_class.verify(token)).to be_nil
        end
      end
    end
  end
end
