class EmotionSelectionNotificationWorker
  attr_reader :users, :time_period

  def initialize
    @users = User.opt_in
    @time_period = TimePeriod.find_or_create_time_period
  end

  def run_notification
    return unless Date.current.strftime('%A').casecmp?(ENV.fetch('DAY_TO_SEND_INVITES'))

    time_period.update(due_date: Date.current)
    run_notification!
  end

  private

  def run_notification!
    @users.each { |user| UserEmailMailer.response_invite(user, time_period).deliver_now }
  end
end
