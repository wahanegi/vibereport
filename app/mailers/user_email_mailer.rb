# frozen_string_literal: true

# Generate email letter CI-32
class UserEmailMailer < ApplicationMailer
  default from: "#{ENV.fetch('DEFAULT_FROM_ADDRESS')}@#{ENV.fetch('EMAIL_DOMAIN')}"
  NUMBER = Emotion::SHOW_NUMBER_PER_CATEGORY
  URL = { controller: 'api/v1/responses', action: 'response_flow_from_email' }.freeze

  def response_invite(user, time_period)
    general_link = URL.merge({ time_period_id: TimePeriod.current, not_working: false, user_id: user.id })
    @link_for_own_word = general_link.merge({ last_step: 'emotion-entry' })
    @link_for_was_not  = general_link.merge({ last_step: 'results' })
    @link_for_emotion  = general_link.merge({ emotion_id: nil, last_step: 'meme-selection' })
    @view_complete_by = range_format(time_period)
    @table = []
    emotions = Emotion.positive.sample(NUMBER) + Emotion.neutral.sample(NUMBER) + Emotion.negative.sample(NUMBER)
    emotions.each_slice(6) { |sliced_emotions| @table << sliced_emotions }
    @table = @table.transpose.flatten
    mail(to: user.email, subject: "Hey #{user.first_name}, how was your week?")
  end

  private

  def range_format(date)
    "#{date.end_date.strftime('%d')} #{date.end_date.strftime('%b')}"
  end
end
