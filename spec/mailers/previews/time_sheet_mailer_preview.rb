# Preview all emails at http://localhost:3000/rails/mailers/time_sheet_mailer
class TimeSheetMailerPreview < ActionMailer::Preview
  def time_sheet_results_email
    time_period = TimePeriod.previous_time_period
    time_sheet_entries = time_period.time_sheet_entries
    TimeSheetMailer.time_sheet_results_email(time_sheet_entries, time_period)
  end
end
