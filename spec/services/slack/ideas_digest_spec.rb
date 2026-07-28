# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Slack::IdeasDigest do
  let(:time_period) { create(:time_period) }

  subject(:digest) { described_class.new(time_period:) }

  def add_idea(topic:, body: 'An idea')
    user = create(:user)
    brainstorming = create(:innovation_brainstorming, innovation_topic: topic, user:, brainstorming_body: body)
    create(:response, time_period:, user:, innovation_brainstorming: brainstorming, innovation_topic: topic)
    brainstorming
  end

  describe '#topic / #prompt' do
    it 'returns the period topic and its body' do
      topic = create(:innovation_topic, time_period:, innovation_body: 'What could we improve?')

      expect(digest.topic).to eq(topic)
      expect(digest.prompt).to eq('What could we improve?')
    end

    it 'returns nil when the period has no topic' do
      expect(digest.topic).to be_nil
      expect(digest.prompt).to be_nil
    end
  end

  describe '#ideas' do
    it 'returns the brainstormings submitted for the period' do
      topic = create(:innovation_topic, time_period:)
      first = add_idea(topic:, body: 'First idea')
      second = add_idea(topic:, body: 'Second idea')

      expect(digest.ideas).to contain_exactly(first, second)
    end

    it 'ignores responses without a brainstorming' do
      create(:innovation_topic, time_period:)
      create(:response, time_period:, user: create(:user))

      expect(digest.ideas).to be_empty
    end

    it 'returns nothing when there is no topic' do
      expect(digest.ideas).to be_empty
    end
  end

  describe '#postable?' do
    it 'is true when there is a topic with at least one idea' do
      topic = create(:innovation_topic, time_period:)
      add_idea(topic:)

      expect(digest).to be_postable
    end

    it 'is false when the topic has no ideas' do
      create(:innovation_topic, time_period:)

      expect(digest).not_to be_postable
    end

    it 'is false when there is no topic' do
      expect(digest).not_to be_postable
    end
  end

  describe 'default time period' do
    it 'uses the previous time period' do
      allow(TimePeriod).to receive(:previous_time_period).and_return(time_period)

      expect(described_class.new.time_period).to eq(time_period)
    end
  end
end
