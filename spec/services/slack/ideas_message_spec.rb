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

    def react(code, user)
      create(:emoji, emoji_code: code, emoji_name: 'x', user:, emojiable: brainstorming)
    end

    it 'maps distinct vote codes to Slack reaction names in canonical order' do
      react('1f680', create(:user)) # 🚀
      react('1f44d', create(:user)) # 👍
      react('1f44d', create(:user)) # 👍 again (different user) -> still one reaction

      expect(described_class.reactions_for(brainstorming)).to eq(%w[thumbsup rocket])
    end

    it 'ignores unknown emoji codes' do
      react('1f44d', create(:user))
      react('abc123', create(:user)) # not one of the four vote types

      expect(described_class.reactions_for(brainstorming)).to eq(%w[thumbsup])
    end

    it 'returns an empty array when there are no reactions' do
      expect(described_class.reactions_for(brainstorming)).to eq([])
    end
  end
end
