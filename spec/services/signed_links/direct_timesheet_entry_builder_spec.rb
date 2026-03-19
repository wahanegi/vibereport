# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SignedLinks::DirectTimesheetEntryBuilder do
  include ActiveSupport::Testing::TimeHelpers

  let(:user) { create(:user) }
  let(:time_period) { create(:time_period) }

  describe '.call' do
    subject(:url) { described_class.call(user, time_period) }

    it 'returns a URL string' do
      expect(url).to be_a(String)
    end

    it 'includes the direct_timesheet_entry path' do
      expect(url).to include('/api/v1/direct_timesheet_entry')
    end

    it 'includes a token parameter' do
      uri = URI.parse(url)
      params = Rack::Utils.parse_query(uri.query)

      expect(params).to have_key('token')
      expect(params['token']).not_to be_blank
    end

    it 'does not include user_id or time_period_id in URL' do
      uri = URI.parse(url)
      params = Rack::Utils.parse_query(uri.query)

      expect(params).not_to have_key('user_id')
      expect(params).not_to have_key('time_period_id')
    end

    it 'generates a token that can be verified back to original data' do
      payload = described_class.verify(Rack::Utils.parse_query(URI.parse(url).query)['token'])

      expect(payload[:user_id]).to eq(user.id)
      expect(payload[:time_period_id]).to eq(time_period.id)
    end

    it 'generates unique URLs for different users' do
      other_user = create(:user)

      expect(described_class.call(user, time_period)).not_to eq(described_class.call(other_user, time_period))
    end

    it 'generates unique URLs for different time periods' do
      other_period = create(:time_period)

      expect(described_class.call(user, time_period)).not_to eq(described_class.call(user, other_period))
    end
  end

  describe '.verify' do
    context 'with a valid token' do
      it 'returns payload with user_id and time_period_id' do
        url = described_class.call(user, time_period)
        token = Rack::Utils.parse_query(URI.parse(url).query)['token']

        payload = described_class.verify(token)

        expect(payload).to be_a(ActiveSupport::HashWithIndifferentAccess)
        expect(payload[:user_id]).to eq(user.id)
        expect(payload[:time_period_id]).to eq(time_period.id)
      end
    end

    context 'with nil token' do
      it 'returns nil' do
        expect(described_class.verify(nil)).to be_nil
      end
    end

    context 'with an empty string token' do
      it 'returns nil' do
        expect(described_class.verify('')).to be_nil
      end
    end

    context 'with a garbage token' do
      it 'returns nil' do
        expect(described_class.verify('invalid-garbage-token')).to be_nil
      end
    end

    context 'with an expired token' do
      it 'returns nil after TTL' do
        url = described_class.call(user, time_period)
        token = Rack::Utils.parse_query(URI.parse(url).query)['token']

        travel(8.days) do
          expect(described_class.verify(token)).to be_nil
        end
      end
    end

    context 'with a token signed for a different purpose' do
      it 'returns nil' do
        different_token = Tokens::SignedToken.encode(
          { user_id: user.id, time_period_id: time_period.id },
          purpose: 'wrong.purpose'
        )

        expect(described_class.verify(different_token)).to be_nil
      end
    end
  end
end
