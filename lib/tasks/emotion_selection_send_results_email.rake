namespace :send_results_email do
  desc 'Send results email'
  task send_results_email: :environment do
    EmotionSelectionNotificationWorker.new.run_notification(:send_results_email)
  end
end
