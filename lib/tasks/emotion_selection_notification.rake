namespace :notifications do
  desc 'Send emotion selection email'
  task emotion_selection_invite_all: :environment do
    date = Time.zone.now
    if date.strftime("%A").downcase == ENV["DAY_TO_SEND_INVITES"].downcase
      EmotionSelectionNotificationWorker.new.run_notification
    end
  end
end
