# Number of months to include in timesheet reports
TIMESHEET_LAST_MONTHS_PERIOD = ENV.fetch('TIMESHEET_LAST_MONTHS_PERIOD', 12).to_i

EXCEL_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'.freeze
