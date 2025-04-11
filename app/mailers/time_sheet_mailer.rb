class TimeSheetMailer < ApplicationMailer
  def time_sheet_results_email(grouped_entries, time_period)
    @grouped_entries = grouped_entries
    @time_period = time_period
    recipients = ENV.fetch('TIMESHEETS_RESULTS_EMAILS', '').split(',')
    @doc_location = ENV.fetch('TIMESHEETS_DOC_LOCATION', nil)

    # TODO: Attaching the file works fine, but the data for creation is incorrect
    # attach_timesheet_csv_file

    mail(to: recipients, subject: "Timesheet Entries for #{@time_period.date_range_str}")
  end

  private

  def attach_timesheet_csv_file
    file_name = "Timesheet Entries #{@time_period.date_range_str} #{@time_period.start_date.year}.csv"
    csv_data = Exporters::TimeSheetCsvExporter.new(@grouped_entries).call # TODO: Need to fix the @grouped_entries

    attachments[file_name] = {
      mine_type: Mime[:csv],
      content: csv_data
    }
  end
end
