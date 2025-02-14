class TimeSheetResultsEmailWorker
  def initialize
    @time_period = TimePeriod.previous_time_period
    @time_sheet_entries = @time_period&.time_sheet_entries
  end

  def run_notification
    return if @time_sheet_entries.empty?
    return unless Date.current.strftime('%A').casecmp?(ENV.fetch('DAY_TO_SEND_RESULTS_EMAIL', nil))

    grouped_entries = group_and_sort_entries(@time_sheet_entries)

    TimeSheetMailer.time_sheet_results_email(grouped_entries, @time_period).deliver_now
  end

  private

  def group_and_sort_entries(entries)
    entries.group_by(&:project).sort_by { |project, _| project.code }
  end
end
