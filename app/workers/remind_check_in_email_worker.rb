class RemindCheckInEmailWorker
  attr_reader :users, :time_period

  def initialize
    @users = User.opt_in
    @time_period = TimePeriod.current
  end

  def run_notification
    return unless Date.current.strftime('%A').casecmp?(ENV['DAY_TO_SEND_FINAL_REMINDER'] || '')

    send_reminder_emails!
  end

  private

  def send_reminder_emails!
    users.each do |user|
      next if user_has_current_response?

      send_reminder_email(user, time_period)
    end
  end

  def send_reminder_email(user, time_period)
    UserEmailMailer.auto_remind_checkin(user, time_period).deliver_now
  end

  def user_has_current_response?(user)
    user.responses.exists?(time_period_id: time_period.id)
  end
end
