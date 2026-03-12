namespace :timesheets do
  desc 'Send daily overdue timesheet reminders'
  task send_overdue_reminders: :environment do
    DailyOverdueTimesheetWorker.new.run_notification
  end
end
