# frozen_string_literal: true

module Slack
  class IdeasMessage
    VOTE_TYPES = {
      '1f44d' => { reaction: 'thumbsup', emoji: '👍' },
      '1f525' => { reaction: 'fire',     emoji: '🔥' },
      '1f9e0' => { reaction: 'brain',    emoji: '🧠' },
      '1f680' => { reaction: 'rocket',   emoji: '🚀' }
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
      vote_counts(brainstorming).keys.map { |code| VOTE_TYPES[code][:reaction] }
    end

    def self.vote_summary(brainstorming)
      parts = vote_counts(brainstorming).map { |code, count| "#{VOTE_TYPES[code][:emoji]} #{count}" }
      return if parts.empty?

      "#{VOTES_LABEL} #{parts.join(' · ')}"
    end

    def self.vote_counts(brainstorming)
      counts = brainstorming.emojis.group_by(&:emoji_code).transform_values(&:size)
      VOTE_TYPES.keys.each_with_object({}) do |code, result|
        count = counts[code]
        result[code] = count if count&.positive?
      end
    end
    private_class_method :vote_counts
  end
end
