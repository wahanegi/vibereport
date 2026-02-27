# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SignedLinks::SignInFromEmailBuilder do
  include ActiveSupport::Testing::TimeHelpers

  let(:user) { create(:user) }
  let(:time_period) { create(:time_period) }

  describe '.url' do
    context 'with user only' do
      subject(:url) { described_class.url(user, time_period: nil) }

      it 'returns URL with sign_in_from_email path' do
        expect(url).to include('/api/v1/sign_in_from_email')
      end

      it 'includes only token in query' do
        uri = URI.parse(url)
        expect(Rack::Utils.parse_query(uri.query).keys).to eq(['token'])
      end

      it 'verifies to payload with user_id only' do
        token = Rack::Utils.parse_query(URI.parse(url).query)['token']
        payload = described_class.verify(token)

        expect(payload[:user_id]).to eq(user.id)
      end
    end

    context 'with user and time_period' do
      subject(:url) { described_class.url(user, time_period: time_period) }

      it 'encodes time_period_id in payload' do
        token = Rack::Utils.parse_query(URI.parse(url).query)['token']
        payload = described_class.verify(token)

        expect(payload[:user_id]).to eq(user.id)
        expect(payload[:time_period_id]).to eq(time_period.id)
      end
    end
  end

  describe '.verify' do
    it 'returns nil for wrong purpose token' do
      token = Tokens::SignedToken.encode({ user_id: user.id }, purpose: 'other.v1')
      expect(described_class.verify(token)).to be_nil
    end

    it 'returns payload for valid token' do
      url = described_class.url(user, time_period: nil)
      token = Rack::Utils.parse_query(URI.parse(url).query)['token']
      expect(described_class.verify(token)[:user_id]).to eq(user.id)
    end
  end
end
