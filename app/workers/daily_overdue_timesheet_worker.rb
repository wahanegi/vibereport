class DailyOverdueTimesheetWorker
  FORCE_DATE_ENV = 'TIMESHEET_FORCE_ENTRY_DATE'.freeze
  DATE_FORMAT    = '%m-%d-%Y'.freeze

  def run
    return unless force_date_reached?

    missing_map = TimeSheets::MissingEntriesFinder.new.call
    return if missing_map.blank?

    send_emails!(missing_map)
  end

  private

  def force_date_reached?
    raw = ENV.fetch(FORCE_DATE_ENV, nil)
    return false if raw.blank?

    force_date = Date.strptime(raw, DATE_FORMAT)
    Date.current >= force_date
  rescue ArgumentError
    Rails.logger.error(
      "[DailyOverdueTimesheetWorker] Invalid #{FORCE_DATE_ENV}=#{raw.inspect}. Expected format #{DATE_FORMAT}."
    )
    false
  end

  def send_emails!(missing_map)
    missing_map.each do |user, missing_periods|
      UserEmailMailer.daily_timesheet_reminder(user, missing_periods).deliver_later
    end
  end
end
