# frozen_string_literal: true

class SlackIdeasNotificationWorker
  def initialize(client: nil, digest: nil, channel: nil)
    @client = client
    @digest = digest
    @channel = channel
  end

  def run_notification
    return unless scheduled_today?
    return unless digest.postable?

    post_ideas!
  end

  def client
    @client ||= Slack::Client.new
  end

  def digest
    @digest ||= Slack::IdeasDigest.new
  end

  def channel
    @channel ||= ENV.fetch('SLACK_IDEAS_CHANNEL')
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
