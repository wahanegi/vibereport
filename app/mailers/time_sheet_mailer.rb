class TimeSheetMailer < ApplicationMailer
  def time_sheet_results_email(grouped_entries, time_period)
    @grouped_entries = grouped_entries
    @time_period = time_period
    recipients = ENV.fetch('TIMESHEETS_RESULTS_EMAILS', '').split(',')
    @doc_location = ENV.fetch('TIMESHEETS_DOC_LOCATION', nil)

    attach_timesheets_csv_file

    mail(to: recipients, subject: "Timesheet Entries for #{@time_period.date_range_str}")
  end

  private

  def attach_timesheets_csv_file
    file_name = "Timesheet Entries #{@time_period.date_range_str} #{@time_period.start_date.year}.csv"
    csv_data = Exporters::TimeSheetCsvExporter.new(@grouped_entries).call

    attachments[file_name] = {
      mine_type: Mime[:csv],
      content: csv_data
    }
  end
end
