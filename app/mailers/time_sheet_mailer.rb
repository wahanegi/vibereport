class TimeSheetMailer < ApplicationMailer
  default from: "#{ENV.fetch('DEFAULT_FROM_ADDRESS')}@#{ENV.fetch('EMAIL_DOMAIN')}"

  def time_sheet_results_email(time_sheet_entries, time_period)
    @time_sheet_entries = time_sheet_entries
    @time_period = time_period
    recipients = ENV.fetch('TIMESHEETS_RESULTS_EMAILS', '').split(',')
    @doc_location = ENV.fetch('TIMESHEETS_DOC_LOCATION', nil)

    mail(to: recipients, subject: "Timesheet Entries for #{@time_period}")
  end
end
