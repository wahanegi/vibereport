namespace :notifications do
  desc 'Send emails to all users who have not yet done a check-in'
  task remind_checkin: :environment do
    RemindCheckInEmailWorker.new.run_notification
  end
end
