# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Slack::Client do
  let(:web_client) { instance_double(Slack::Web::Client) }

  subject(:client) { described_class.new(web_client:) }

  describe '#post_message' do
    it 'posts the message and returns its ts' do
      allow(web_client).to receive(:chat_postMessage).and_return('ts' => '1700000000.000100')

      ts = client.post_message(channel: 'C1', blocks: [{ type: 'divider' }], text: 'fallback')

      expect(web_client).to have_received(:chat_postMessage)
        .with(channel: 'C1', blocks: [{ type: 'divider' }], text: 'fallback')
      expect(ts).to eq('1700000000.000100')
    end

    it 'includes thread_ts when posting a threaded reply' do
      allow(web_client).to receive(:chat_postMessage).and_return('ts' => '1700000000.000200')

      client.post_message(channel: 'C1', blocks: [], text: 'fallback', thread_ts: '1700000000.000100')

      expect(web_client).to have_received(:chat_postMessage)
        .with(channel: 'C1', blocks: [], text: 'fallback', thread_ts: '1700000000.000100')
    end

    it 'omits thread_ts when not replying' do
      allow(web_client).to receive(:chat_postMessage).and_return('ts' => '1')

      client.post_message(channel: 'C1', blocks: [], text: 'fallback')

      expect(web_client).to have_received(:chat_postMessage).with(hash_excluding(:thread_ts))
    end

    it 'logs and returns nil on a Slack error' do
      allow(web_client).to receive(:chat_postMessage)
        .and_raise(Slack::Web::Api::Errors::SlackError.new('channel_not_found'))

      expect(client.post_message(channel: 'C1', blocks: [], text: 'fallback')).to be_nil
    end
  end

  describe '#add_reaction' do
    it 'adds the reaction and returns true' do
      allow(web_client).to receive(:reactions_add).and_return('ok' => true)

      result = client.add_reaction(channel: 'C1', timestamp: '1700000000.000100', name: 'fire')

      expect(web_client).to have_received(:reactions_add)
        .with(channel: 'C1', timestamp: '1700000000.000100', name: 'fire')
      expect(result).to be(true)
    end

    it 'treats already_reacted as success' do
      allow(web_client).to receive(:reactions_add)
        .and_raise(Slack::Web::Api::Errors::SlackError.new('already_reacted'))

      expect(client.add_reaction(channel: 'C1', timestamp: '1', name: 'fire')).to be(true)
    end

    it 'returns false on any other Slack error' do
      allow(web_client).to receive(:reactions_add)
        .and_raise(Slack::Web::Api::Errors::SlackError.new('invalid_name'))

      expect(client.add_reaction(channel: 'C1', timestamp: '1', name: 'nope')).to be(false)
    end
  end
end
