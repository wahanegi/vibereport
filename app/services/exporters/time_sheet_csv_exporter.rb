# Exports timesheet entries to a CSV
class Exporters::TimeSheetCsvExporter
  DEFAULT_OPTIONS = { headers: true }.freeze
  HEADERS = ['Project Code', 'Name', 'Hours'].freeze

  def initialize(time_sheets, options = {})
    @time_sheets = time_sheets
    @options = DEFAULT_OPTIONS.merge(options)
  end

  def call
    CSV.generate(**@options) do |csv|
      csv << HEADERS

      @time_sheets.each do |time_sheet|
        csv << [time_sheet.project.code, time_sheet.project.name, time_sheet.total_hours]
      end
    end
  end
end
