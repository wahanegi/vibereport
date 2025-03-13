namespace :timesheets do
  desc 'Send timesheet results email'
  task send_results: :environment do
    TimeSheetResultsEmailWorker.new.run_notification
  end
end
