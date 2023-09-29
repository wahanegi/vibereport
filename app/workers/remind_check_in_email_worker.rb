class RemindCheckInEmailWorker
  attr_reader :current_user, :response, :time_period

  def initialize
    @users = User.opt_in
    @time_period = TimePeriod.current_time_period
  end

  def run_notification
    return unless Date.current.strftime('%A').casecmp?(ENV.fetch('DAY_TO_SEND_REMIND_CHECKIN'))

    run_results_email!
  end

  private

  def run_results_email!
    return unless time_period_has_not_ended?

    users.each do |user|
      send_remind_email(user, time_period) if user_has_not_response?(user)
    end
  end

  def send_remind_email(user, time_period)
    UserEmailMailer.auto_remind_checkin(user, time_period).deliver_now
  end

  def time_period_has_not_ended?
    time_period.present? && time_period.end_date >= Date.current
  end

  def user_has_not_response?(user)
    !user.responses.exists?(time_period_id: time_period.id)
  end
end
