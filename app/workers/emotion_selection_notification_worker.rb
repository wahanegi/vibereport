class EmotionSelectionNotificationWorker
  attr_reader :users, :time_period

  def initialize
    @users = User.opt_in
    @time_period = TimePeriod.current
  end

  def run_notification
    return if Date.current.strftime("%A").downcase != ENV["DAY_TO_SEND_INVITES"].downcase

    run_notification!
  end

  def run_notification!
    @users.each { |user| UserEmailMailer.response_invite(user, time_period).deliver_now }
  end
end
