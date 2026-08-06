# frozen_string_literal: true

module Slack
  class IdeasDigest
    attr_reader :time_period

    def initialize(time_period: TimePeriod.previous_time_period)
      @time_period = time_period
    end

    def postable?
      topic.present? && ideas.any?
    end

    def topic
      @topic ||= time_period&.innovation_topic
    end

    def prompt
      topic&.innovation_body
    end

    def ideas
      @ideas ||= load_ideas
    end

    private

    def load_ideas
      return [] unless topic

      time_period.responses
                 .includes(innovation_brainstorming: [:user, :emojis])
                 .filter_map(&:innovation_brainstorming)
    end
  end
end
