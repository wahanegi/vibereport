# frozen_string_literal: true

module Slack
  class IdeasMessage
    # Vote types come from the frontend (consts.js: BRAINSTORMING_ALLOWED_EMOJIS); keep the codes in sync.
    VOTE_TYPES = {
      '1f44d' => { reaction: 'thumbsup', emoji: '👍' }, # interesting
      '1f525' => { reaction: 'fire',     emoji: '🔥' }, # high impact
      '1f9e0' => { reaction: 'brain',    emoji: '🧠' }, # clever
      '1f680' => { reaction: 'rocket',   emoji: '🚀' }  # explore
    }.freeze

    HEADER = 'Weekly Idea Prompt'
    LEGEND = 'Vote using reactions: 👍 interesting • 🔥 high impact • 🧠 clever • 🚀 explore'
    VOTES_LABEL = 'Voted in Vibe.Report:'

    def self.parent(prompt:)
      {
        text: prompt,
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: HEADER } },
          { type: 'section', text: { type: 'mrkdwn', text: "*#{prompt}*" } },
          { type: 'context', elements: [{ type: 'mrkdwn', text: LEGEND }] }
        ]
      }
    end

    def self.idea(brainstorming)
      author = brainstorming.user&.full_name.presence || 'Anonymous'
      body = brainstorming.brainstorming_body.to_s

      blocks = [
        { type: 'context', elements: [{ type: 'mrkdwn', text: "*#{author}*" }] },
        { type: 'section', text: { type: 'plain_text', text: body, emoji: true } }
      ]
      summary = vote_summary(brainstorming)
      blocks << { type: 'context', elements: [{ type: 'mrkdwn', text: summary }] } if summary

      { text: "#{author}: #{body}", blocks: }
    end

    def self.reactions_for(brainstorming)
      present = brainstorming.emojis.map(&:emoji_code).uniq
      VOTE_TYPES.filter_map { |code, meta| meta[:reaction] if present.include?(code) }
    end

    def self.vote_summary(brainstorming)
      counts = brainstorming.emojis.group_by(&:emoji_code).transform_values(&:size)
      parts = VOTE_TYPES.filter_map do |code, meta|
        count = counts[code]
        "#{meta[:emoji]} #{count}" if count&.positive?
      end
      return if parts.empty?

      "#{VOTES_LABEL} #{parts.join(' · ')}"
    end
  end
end
