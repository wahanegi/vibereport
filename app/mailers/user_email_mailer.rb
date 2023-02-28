# frozen_string_literal: true

# Generate email letter CI-32
class UserEmailMailer < ApplicationMailer
  default from: "do_not_reply@#{ENV['EMAIL_DOMAIN']}"
  NUMBER_OF_ELEMENTS = Emotion::SHOW_NUMBER_PER_CATEGORY


  def response_invite(user, time_period)
    @user = user
    @view_calendar_days = range_format(time_period)
    @positive_emotions = Emotion.positive.sample(NUMBER_OF_ELEMENTS)
    @neutral_emotions = Emotion.neutral.sample(NUMBER_OF_ELEMENTS)
    @negative_emotions = Emotion.negative.sample(NUMBER_OF_ELEMENTS)
    mail(to: user.email, subject: "Hey #{@user.first_name}, how was your week?")
  end

  private


  def range_format(date)
    "#{date.start_date.strftime('%d')}-#{date.end_date.strftime('%d')} #{date.end_date.strftime('%b')}"
  end
end
