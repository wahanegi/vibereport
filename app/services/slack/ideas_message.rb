# frozen_string_literal: true

module Slack
  class IdeasMessage
    EMOJI_MAP = {
      '1f44d' => 'thumbsup', # 👍 interesting
      '1f525' => 'fire',     # 🔥 high impact
      '1f9e0' => 'brain',    # 🧠 clever
      '1f680' => 'rocket'    # 🚀 explore
    }.freeze

    HEADER = 'Weekly Idea Prompt'
    LEGEND = 'Vote using reactions: 👍 interesting • 🔥 high impact • 🧠 clever • 🚀 explore'

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

      {
        text: "#{author}: #{body}",
        blocks: [
          { type: 'context', elements: [{ type: 'mrkdwn', text: "*#{author}*" }] },
          { type: 'section', text: { type: 'plain_text', text: body, emoji: true } }
        ]
      }
    end

    def self.reactions_for(brainstorming)
      present = brainstorming.emojis.map(&:emoji_code).uniq
      EMOJI_MAP.filter_map { |code, name| name if present.include?(code) }
    end
  end
end
