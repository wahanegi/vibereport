namespace :notifications do
  desc 'Send emotion selection email'
  task emotion_selection_invite_all: :environment do
    EmotionSelectionNotificationWorker.new.run_notification
  end

  desc 'Send results email'
  task send_results_email: :environment do
    EmotionSelectionNotificationWorker.new.run_notification(:send_results_email)
  end
end
