# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Slack::IdeasMessage do
  describe '.parent' do
    subject(:parent) { described_class.parent(prompt: 'What should we improve?') }

    it 'builds a header, the prompt section and the voting legend' do
      types = parent[:blocks].map { |b| b[:type] }
      expect(types).to eq(%w[header section context])

      expect(parent[:blocks][0][:text][:text]).to eq('Weekly Idea Prompt')
      expect(parent[:blocks][1][:text][:text]).to eq('*What should we improve?*')
      expect(parent[:blocks][2][:elements].first[:text]).to include('👍 interesting', '🚀 explore')
    end

    it 'uses the prompt as fallback text' do
      expect(parent[:text]).to eq('What should we improve?')
    end
  end

  describe '.idea' do
    let(:user) { build(:user, first_name: 'Roger', last_name: 'Graves') }
    let(:brainstorming) { build(:innovation_brainstorming, user:, brainstorming_body: 'AI onboarding tour') }

    subject(:idea) { described_class.idea(brainstorming) }

    it 'builds an author context and the idea body section' do
      expect(idea[:blocks][0]).to eq(
        { type: 'context', elements: [{ type: 'mrkdwn', text: '*Roger Graves*' }] }
      )
      expect(idea[:blocks][1]).to eq(
        { type: 'section', text: { type: 'plain_text', text: 'AI onboarding tour', emoji: true } }
      )
    end

    it 'uses "author: body" as fallback text' do
      expect(idea[:text]).to eq('Roger Graves: AI onboarding tour')
    end

    it 'falls back to Anonymous when the author is missing' do
      brainstorming.user = nil
      expect(idea[:blocks][0][:elements].first[:text]).to eq('*Anonymous*')
    end
  end

  describe '.reactions_for' do
    let(:brainstorming) { create(:innovation_brainstorming) }

    it 'always returns all four default reactions in canonical order' do
      expect(described_class.reactions_for(brainstorming)).to eq(%w[thumbsup fire brain rocket])
    end

    it 'returns the same four reactions regardless of how the idea was voted on during check-in' do
      create(:emoji, emoji_code: '1f680', emoji_name: 'x', user: create(:user), emojiable: brainstorming)

      expect(described_class.reactions_for(brainstorming)).to eq(%w[thumbsup fire brain rocket])
    end
  end

  describe '.vote_summary' do
    let(:brainstorming) { create(:innovation_brainstorming) }

    def vote(code)
      create(:emoji, emoji_code: code, emoji_name: 'x', user: create(:user), emojiable: brainstorming)
    end

    it 'summarises counts per vote type in canonical order, with a label' do
      2.times { vote('1f44d') }
      vote('1f525')

      expect(described_class.vote_summary(brainstorming)).to eq('Voted in Vibe.Report: 👍 2 · 🔥 1')
    end

    it 'skips vote types with no votes' do
      vote('1f9e0')

      expect(described_class.vote_summary(brainstorming)).to eq('Voted in Vibe.Report: 🧠 1')
    end

    it 'returns nil when there are no votes' do
      expect(described_class.vote_summary(brainstorming)).to be_nil
    end
  end

  describe '.idea vote-count block' do
    let(:brainstorming) { create(:innovation_brainstorming) }

    it 'appends a context block with the vote summary when votes exist' do
      create(:emoji, emoji_code: '1f44d', emoji_name: 'x', user: create(:user), emojiable: brainstorming)

      blocks = described_class.idea(brainstorming)[:blocks]

      expect(blocks.size).to eq(3)
      expect(blocks.last[:elements].first[:text]).to eq('Voted in Vibe.Report: 👍 1')
    end

    it 'omits the vote block when there are no votes' do
      expect(described_class.idea(brainstorming)[:blocks].size).to eq(2)
    end
  end
end
