class TimeSheetResultsEmailWorker
  def initialize
    @time_period = TimePeriod.previous_time_period
    @time_sheet_entries = @time_period&.time_sheet_entries
  end

  def run_notification
    return if @time_sheet_entries.empty?
    return unless Date.current.strftime('%A').casecmp?(ENV.fetch('DAY_TO_SEND_RESULTS_EMAIL', nil))

    TimeSheetMailer.time_sheet_results_email(@time_sheet_entries, @time_period).deliver_now
  end
end
