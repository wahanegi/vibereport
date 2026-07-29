# frozen_string_literal: true

class SlackIdeasNotificationWorker
  attr_reader :client, :digest, :channel

  def initialize(client: Slack::Client.new, digest: Slack::IdeasDigest.new, channel: ENV.fetch('SLACK_IDEAS_CHANNEL'))
    @client = client
    @digest = digest
    @channel = channel
  end

  def run_notification
    return unless scheduled_today?
    return unless digest.postable?

    post_ideas!
  end

  private

  def scheduled_today?
    Date.current.strftime(DateFormats::DAY_NAME_FULL).casecmp?(ENV.fetch('DAY_TO_SEND_IDEAS_TO_SLACK'))
  end

  def post_ideas!
    parent = Slack::IdeasMessage.parent(prompt: digest.prompt)
    parent_ts = client.post_message(channel:, blocks: parent[:blocks], text: parent[:text])
    return unless parent_ts

    digest.ideas.each { |idea| post_idea(idea, parent_ts) }
  end

  def post_idea(idea, parent_ts)
    message = Slack::IdeasMessage.idea(idea)
    idea_ts = client.post_message(channel:, blocks: message[:blocks], text: message[:text], thread_ts: parent_ts)
    return unless idea_ts

    Slack::IdeasMessage.reactions_for(idea).each do |name|
      client.add_reaction(channel:, timestamp: idea_ts, name:)
    end
  rescue StandardError => e
    Rails.logger.error("[SlackIdeasNotificationWorker] failed to post idea #{idea.id}: #{e.message}")
  end
end
