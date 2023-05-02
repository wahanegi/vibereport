namespace :notifications do
  desc 'Send emotion selection email'
  task emotion_selection_invite_all: :environment do
    EmotionSelectionNotificationWorker.new.run_notification
  end
end
