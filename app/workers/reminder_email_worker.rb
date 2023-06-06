class ReminderEmailWorker
  attr_reader :current_user, :response, :time_period

  def initialize(current_user, response, time_period)
    @current_user = current_user
    @response = response
    @time_period = time_period
  end

  def run_notification
    UserEmailMailer.reminder_email(current_user, response, time_period).deliver_later(wait: 30.minutes)
  end
end
