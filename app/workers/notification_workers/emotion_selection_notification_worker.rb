module NotificationWorkers
  class EmotionSelectionNotificationWorker

    attr_reader :users, :time_period

    def initialize
      @users = User.opt_in
      @time_period = TimePeriod.last
    end

    def run_notification
      @users.each do |user|
        UserEmailMailer.response_invite(user, time_period).deliver_now
      end
    end
  end
end
