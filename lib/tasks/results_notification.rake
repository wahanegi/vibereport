namespace :notifications do
  desc 'Send results email'
  task send_results_email: :environment do
    ResultsNotificationWorker.new.run_notification
  end
end
