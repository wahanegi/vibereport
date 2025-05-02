namespace :notifications do
  desc 'Send out daily emails for shoutouts that get reactions'
  task send_reactions: :environment do
    EmojiReactionEmailWorker.new.run_notification
  end
end
