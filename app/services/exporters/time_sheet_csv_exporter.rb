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

      @time_sheets.each do |project, time_sheets|
        time_sheets.each do |time_sheet|
          csv << [project.code, time_sheet.user.full_name, time_sheet.total_hours]
        end
      end
    end
  end
end
