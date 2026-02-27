# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SignedLinks::ResultsEmailBuilder do
  include ActiveSupport::Testing::TimeHelpers

  let(:user) { create(:user) }
  let(:time_period) { create(:time_period) }

  describe '.url' do
    subject(:url) { described_class.url(user, time_period) }

    it 'returns URL with results_email path' do
      expect(url).to include('/api/v1/results_email')
    end

    it 'includes only token in query' do
      uri = URI.parse(url)
      expect(Rack::Utils.parse_query(uri.query).keys).to eq(['token'])
    end

    it 'verifies to payload with user_id and time_period_slug' do
      token = Rack::Utils.parse_query(URI.parse(url).query)['token']
      payload = described_class.verify(token)

      expect(payload[:user_id]).to eq(user.id)
      expect(payload[:time_period_slug]).to eq(time_period.slug)
    end
  end

  describe '.verify' do
    it 'returns nil for invalid token' do
      expect(described_class.verify('garbage')).to be_nil
    end

    it 'returns payload for valid token' do
      url = described_class.url(user, time_period)
      token = Rack::Utils.parse_query(URI.parse(url).query)['token']
      payload = described_class.verify(token)

      expect(payload[:user_id]).to eq(user.id)
      expect(payload[:time_period_slug]).to eq(time_period.slug)
    end

    it 'returns nil for expired token' do
      url = described_class.url(user, time_period)
      token = Rack::Utils.parse_query(URI.parse(url).query)['token']

      travel(8.days) do
        expect(described_class.verify(token)).to be_nil
      end
    end
  end
end
