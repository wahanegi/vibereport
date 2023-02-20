namespace :notifications do
  desc 'Send emotion selection email'
  task emotion_notification: :environment do
    NotificationWorkers::EmotionSelectionNotificationWorker.new.run_notification
  end
end
