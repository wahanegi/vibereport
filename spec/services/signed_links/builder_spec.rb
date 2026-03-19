# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SignedLinks::Builder do
  include ActiveSupport::Testing::TimeHelpers

  let(:purpose) { 'test.purpose.v1' }
  let(:payload) { { user_id: 1, time_period_id: 2 } }
  let(:route_name) { :api_v1_direct_timesheet_entry_url }
  let(:expires_in) { 7.days }

  describe '.build_url' do
    subject(:url) do
      described_class.build_url(purpose: purpose, payload: payload, route_name: route_name, expires_in: expires_in)
    end

    it 'returns a URL string' do
      expect(url).to be_a(String)
    end

    it 'includes path for the route' do
      expect(url).to include('/api/v1/direct_timesheet_entry')
    end

    it 'includes a token query parameter' do
      uri = URI.parse(url)
      params = Rack::Utils.parse_query(uri.query)

      expect(params).to have_key('token')
      expect(params['token']).not_to be_blank
    end

    it 'generates a token that decodes back to the payload with same purpose' do
      uri = URI.parse(url)
      params = Rack::Utils.parse_query(uri.query)
      decoded = described_class.verify(params['token'], purpose: purpose)

      expect(decoded).to be_a(ActiveSupport::HashWithIndifferentAccess)
      expect(decoded[:user_id]).to eq(1)
      expect(decoded[:time_period_id]).to eq(2)
    end

    it 'uses default expires_in when not passed' do
      url_default = described_class.build_url(purpose: purpose, payload: payload, route_name: route_name)
      token_default = Rack::Utils.parse_query(URI.parse(url_default).query)['token']

      travel(expires_in + 1.day) do
        expect(described_class.verify(token_default, purpose: purpose)).to be_nil
      end
    end

    it 'raises when purpose is blank' do
      expect do
        described_class.build_url(purpose: '', payload: payload, route_name: route_name)
      end.to raise_error(ArgumentError, /purpose/)
    end

    it 'raises when payload is not a Hash' do
      expect do
        described_class.build_url(purpose: purpose, payload: [1, 2], route_name: route_name)
      end.to raise_error(ArgumentError, /payload/)
    end
  end

  describe '.verify' do
    context 'with a valid token' do
      it 'returns payload with indifferent access' do
        url = described_class.build_url(purpose: purpose, payload: payload, route_name: route_name)
        token = Rack::Utils.parse_query(URI.parse(url).query)['token']

        result = described_class.verify(token, purpose: purpose)

        expect(result).to be_a(ActiveSupport::HashWithIndifferentAccess)
        expect(result['user_id']).to eq(1)
        expect(result[:user_id]).to eq(1)
      end
    end

    context 'with nil token' do
      it 'returns nil' do
        expect(described_class.verify(nil, purpose: purpose)).to be_nil
      end
    end

    context 'with empty string token' do
      it 'returns nil' do
        expect(described_class.verify('', purpose: purpose)).to be_nil
      end
    end

    context 'with garbage token' do
      it 'returns nil' do
        expect(described_class.verify('invalid-garbage', purpose: purpose)).to be_nil
      end
    end

    context 'with wrong purpose' do
      it 'returns nil' do
        url = described_class.build_url(purpose: purpose, payload: payload, route_name: route_name)
        token = Rack::Utils.parse_query(URI.parse(url).query)['token']

        expect(described_class.verify(token, purpose: 'other.purpose.v1')).to be_nil
      end
    end

    context 'with expired token' do
      it 'returns nil after expires_in' do
        url = described_class.build_url(purpose: purpose, payload: payload, route_name: route_name, expires_in: 1.hour)
        token = Rack::Utils.parse_query(URI.parse(url).query)['token']

        travel(2.hours) do
          expect(described_class.verify(token, purpose: purpose)).to be_nil
        end
      end
    end
  end
end
