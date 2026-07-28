# frozen_string_literal: true

module Slack
  # Wrapper around the Slack Web API — the app's single point of contact with Slack.
  class Client
    ALREADY_REACTED = 'already_reacted'

    def initialize(web_client: nil)
      @web_client = web_client || ::Slack::Web::Client.new(token: ENV.fetch('SLACK_BOT_TOKEN'))
    end

    def post_message(channel:, blocks:, text:, thread_ts: nil)
      args = { channel:, blocks:, text:, thread_ts: }.compact
      @web_client.chat_postMessage(**args)['ts']
    rescue ::Slack::Web::Api::Errors::SlackError => e
      Rails.logger.error("[Slack::Client] chat.postMessage failed: #{e.message}")
      nil
    end

    def add_reaction(channel:, timestamp:, name:)
      @web_client.reactions_add(channel:, timestamp:, name:)
      true
    rescue ::Slack::Web::Api::Errors::SlackError => e
      return true if e.message == ALREADY_REACTED

      Rails.logger.error("[Slack::Client] reactions.add failed: #{e.message}")
      false
    end
  end
end
