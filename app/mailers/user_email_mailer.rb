class UserEmailMailer < ApplicationMailer
  default from: "do_not_reply@#{ENV['EMAIL_DOMAIN']}"

  def response_invite (user, current_time_period)
    @positive_emotions = Emotion.positive.sample(12)
    @neutral_emotions = Emotion.neutral.sample(12)
    @negative_emotions = Emotion.negative.sample(12)
  end
end
