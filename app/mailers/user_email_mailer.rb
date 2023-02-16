
class UserEmailMailer < ApplicationMailer
  default from: "do_not_reply@#{ENV.fetch('EMAIL_DOMAIN')}"
  NUMBER_ELEMENTS = 12

  def response_invite(user, time_period)
     @current_user = user
     @current_time_period = "#{two_digits(time_period.start_date.day)}-#{two_digits(time_period.end_date.day)}"
     @current_time_period += " #{time_period.end_date.strftime('%b')}"
     @positive_emotions = Emotion.positive.sample(NUMBER_ELEMENTS)
     @neutral_emotions = Emotion.neutral.sample(NUMBER_ELEMENTS)
     @negative_emotions = Emotion.negative.sample(NUMBER_ELEMENTS)
     # @negative_emotions[6].word = "misunderstooood"
     mail(to: user.email, subject: "Hey #{@current_user.first_name}, how was your week?")
  end

    private

  # Output two digits in the day of the calendar
  def two_digits(value_of_day)
    value_of_day.to_s.length == 1 ? "0#{value_of_day}" : value_of_day.to_s
  end
end
