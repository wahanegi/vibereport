# class ReminderEmailWorker
#   attr_reader :users, :time_period
#
#   def perform(user_id)
#     user = User.find_by(id: user_id)
#     return unless user
#
#     UserEmailMailer.reminder_email(user).deliver_now
#   end
#
#   # def perform(user_id)
#   #   user = User.find_by(id: user_id)
#   #   return unless user && user.opt_in? && user_has_response?(user)
#   #
#   #   reminder_link = generate_reminder_link()
#   #   UserEmailMailer.reminder_email_with_reminder_link(user, reminder_link).deliver_now
#   #   UserEmailMailer.reminder_email(user).deliver_now
#   # end
# end

  # private
  #
  # def user_has_response?(user)
  #   user.responses.exists?(time_period_id: time_period.id)
  # end

  # def generate_reminder_link
  #
  # end
# end

class ReminderEmailWorker
  def perform(user_id)
    user = User.find_by(id: user_id)
    return unless user

    UserEmailMailer.response_invite(user, TimePeriod.current).deliver_now
  end
end