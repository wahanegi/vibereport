class TimeSheetResultsEmailWorker
  def initialize
    @time_period = TimePeriod.previous_time_period
    @time_sheet_entries = @time_period&.time_sheet_entries
  end

  def run_notification
    return unless Date.current.strftime('%A')
                      .casecmp?(ENV.fetch('DAY_TO_SEND_RESULTS_EMAIL', nil))

    excel_entries = fetch_entries
    attach_excel = excel_entries.present?

    grouped_entries_for_html = @time_sheet_entries.present? ? group_and_sort_entries(@time_sheet_entries) : nil

    TimeSheetMailer.time_sheet_results_email(
      excel_entries,
      grouped_entries_for_html,
      @time_period,
      attach_excel: attach_excel,
    ).deliver_now
  end

  private

  def group_and_sort_entries(entries)
    entries.group_by(&:project)
           .sort_by { |project, _| project.code }
           .to_h
           .transform_values { |entries| entries.sort { |a, b| b.total_hours <=> a.total_hours } }
  end

  def fetch_entries
    TimeSheetEntry
      .includes(:project, :user, :time_period) # avoids N+1 queries
      .joins(:time_period)
      .merge(TimePeriod.finished)
      .where(time_periods: { start_date: TIMESHEET_LAST_MONTHS_PERIOD.months.ago.beginning_of_week..Date.current })
  end
end
