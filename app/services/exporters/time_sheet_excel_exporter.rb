# Generates an Excel file with multiple sheets (one per week)
class Exporters::TimeSheetExcelExporter
  HEADERS = ['Project Code', 'Name', 'Hours'].freeze
  MAX_SHEET_NAME_LENGTH = 31 # Excel limits sheet names to 31 characters

  def initialize(entries)
    @entries = entries
  end

  def call
    package = Axlsx::Package.new
    workbook = package.workbook
    entries_by_period = @entries.group_by(&:time_period)

    entries_by_period
      .select { |tp, _| tp.end_date < Date.current }
      .sort_by { |tp, _| tp.start_date }
      .reverse_each do |time_period, entries|

      sheet_name = time_period.date_range_str.first(MAX_SHEET_NAME_LENGTH)

      workbook.add_worksheet(name: sheet_name) do |sheet|
        # header row
        sheet.add_row HEADERS, style: header_style(sheet)
        # other rows
        entries
          .sort_by { |entry| [entry.project.code, entry.user.full_name] }
          .each do |entry|
          sheet.add_row [
            entry.project.code,
            entry.user.full_name,
            entry.total_hours
          ]
        end
      end
    end

    package.to_stream.read
  end

  private

  def header_style(sheet)
    sheet.styles.add_style(b: true)
  end
end
