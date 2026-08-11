# frozen_string_literal: true

module Slack
  class IdeasDigest
    PERIOD_SELECTORS = {
      'previous' => -> { TimePeriod.previous_time_period },
      'current' => -> { TimePeriod.find_or_create_time_period }
    }.freeze

    DEFAULT_PERIOD_SELECTOR = 'previous'

    attr_reader :time_period

    def initialize(time_period: self.class.default_time_period)
      @time_period = time_period
    end

    # The digest normally covers the week that has just closed. Set
    # SLACK_IDEAS_TIME_PERIOD to 'current' when the notification is scheduled on the
    # last day of the period itself, before the check-in closes. Anything else falls
    # back to the previous period.
    def self.default_time_period
      name = ENV.fetch('SLACK_IDEAS_TIME_PERIOD', DEFAULT_PERIOD_SELECTOR).strip.downcase
      selector = PERIOD_SELECTORS.fetch(name, PERIOD_SELECTORS[DEFAULT_PERIOD_SELECTOR])
      selector.call
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
