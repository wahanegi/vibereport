# frozen_string_literal: true

# Generate email letter CI-32
class UserEmailMailer < ApplicationMailer
  default from: "do_not_reply@#{ENV.fetch('EMAIL_DOMAIN')}"
  NUMBER_OF_ELEMENTS = Emotion::SHOW_NUMBER_PER_CATEGORY

  def response_invite(user, time_period)
    @user = user
    @view_calendar_days = range_format(time_period)
    # @positive_emotions = Emotion.positive.sample(NUMBER_OF_ELEMENTS)
    # @neutral_emotions = Emotion.neutral.sample(NUMBER_OF_ELEMENTS)
    # @negative_emotions = Emotion.negative.sample(NUMBER_OF_ELEMENTS)
    @emotions = Emotion.positive.sample(NUMBER_OF_ELEMENTS) +
                Emotion.neutral.sample(NUMBER_OF_ELEMENTS) +
                Emotion.negative.sample(NUMBER_OF_ELEMENTS)
    @table = []
    (0..@emotions.length - 1).each { |index| @table.push(@emotions[count(index)]) }

    @time_period = time_period
    mail(to: user.email, subject: "Hey #{@user.first_name}, how was your week?")
  end

  private
  def count(index)
    (index - (6 * (index / 6).ceil - 1)) * 6 - ((index / 6).ceil - 1) - 2
  end

  def range_format(date)
    "#{date.start_date.strftime('%d')}-#{date.end_date.strftime('%d')} #{date.end_date.strftime('%b')}"
  end
end
