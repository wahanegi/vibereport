# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SignedLinks::UnsubscribeBuilder do
  include ActiveSupport::Testing::TimeHelpers

  let(:user) { create(:user) }

  describe '.url' do
    subject(:url) { described_class.url(user) }

    it 'returns URL with unsubscribe path' do
      expect(url).to include('/api/v1/unsubscribe')
    end

    it 'includes only token in query' do
      uri = URI.parse(url)
      expect(Rack::Utils.parse_query(uri.query).keys).to eq(['token'])
    end

    it 'verifies to payload with user_id' do
      token = Rack::Utils.parse_query(URI.parse(url).query)['token']
      payload = described_class.verify(token)

      expect(payload[:user_id]).to eq(user.id)
    end
  end

  describe '.verify' do
    it 'returns nil for invalid token' do
      expect(described_class.verify(nil)).to be_nil
      expect(described_class.verify('invalid')).to be_nil
    end

    it 'returns payload for valid token' do
      url = described_class.url(user)
      token = Rack::Utils.parse_query(URI.parse(url).query)['token']
      expect(described_class.verify(token)[:user_id]).to eq(user.id)
    end
  end
end
