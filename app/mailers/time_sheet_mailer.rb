class TimeSheetMailer < ApplicationMailer
  EXCEL_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'.freeze
  TIMESHEET_DISPLAY_DATE_FORMAT = '%d %b %Y'.freeze

  def time_sheet_results_email(entries, grouped_entries, time_period, attach_excel: true, last_months_period: 12)
    @grouped_entries = grouped_entries
    @time_period = time_period
    @doc_location = ENV.fetch('TIMESHEETS_DOC_LOCATION', nil)
    @has_entries_in_report_range = attach_excel
    @time_sheet_last_months_period = last_months_period

    recipients = ENV.fetch('TIMESHEETS_RESULTS_EMAILS', '').split(',')

    attach_timesheets_excel_file(entries) if attach_excel

    mail(
      to: recipients,
      subject: "Timesheet Entries #{Time.zone.today.strftime(TIMESHEET_DISPLAY_DATE_FORMAT)}"
    )
  end

  private

  def attach_timesheets_excel_file(entries)
    file_name = "Timesheet Entries #{Time.zone.today.strftime(TIMESHEET_DISPLAY_DATE_FORMAT)}.xlsx"
    excel_data = Exporters::TimeSheetExcelExporter.new(entries).call

    attachments[file_name] = {
      mime_type: EXCEL_MIME_TYPE,
      content: excel_data
    }
  end
end
