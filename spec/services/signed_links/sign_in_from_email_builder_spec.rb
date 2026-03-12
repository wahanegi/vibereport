# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SignedLinks::SignInFromEmailBuilder do
  include ActiveSupport::Testing::TimeHelpers

  let(:user) { create(:user) }

  describe '.url' do
    subject(:url) { described_class.url(user) }

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

  describe '.verify' do
    it 'returns nil for wrong purpose token' do
      token = Tokens::SignedToken.encode({ user_id: user.id }, purpose: 'other.v1')
      expect(described_class.verify(token)).to be_nil
    end

    it 'returns payload for valid token' do
      url = described_class.url(user)
      token = Rack::Utils.parse_query(URI.parse(url).query)['token']
      expect(described_class.verify(token)[:user_id]).to eq(user.id)
    end
  end
end
