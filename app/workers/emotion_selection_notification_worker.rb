class EmotionSelectionNotificationWorker
  attr_reader :users, :time_period

  def initialize
    @users = User.opt_in
    find_or_create_time_period
  end

  def run_notification
    return if Date.current.strftime('%A').downcase != ENV['DAY_TO_SEND_INVITES'].downcase
    run_notification!
  end

  private

  def run_notification!
    @users.each { |user| UserEmailMailer.response_invite(user, time_period).deliver_now }
  end

  def find_or_create_time_period
    @time_period = TimePeriod.current || TimePeriod.create_time_period
  end
end
