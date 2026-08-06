namespace :notifications do
  desc 'Post weekly ideas to the #ideas Slack channel'
  task post_ideas_to_slack: :environment do
    SlackIdeasNotificationWorker.new.run_notification
  end
end
