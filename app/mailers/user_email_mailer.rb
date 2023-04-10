# frozen_string_literal: true

# Generate email letter CI-32
class UserEmailMailer < ApplicationMailer
  default from: "#{ENV.fetch('DEFAULT_FROM_ADDRESS')}@#{ENV.fetch('EMAIL_DOMAIN')}"
  NUMBER_OF_ELEMENTS = Emotion::SHOW_NUMBER_PER_CATEGORY

  def response_invite(user, time_period)
    @user = user
    @general_link = { controller: 'api/v1/responses', action: 'response_flow_from_email',
                     time_period_id: TimePeriod.current, not_working: false, user_id: user.id }
    @link_for_own_word = @general_link.merge({ last_step: 'emotion-entry' })
    @link_for_was_not  = @general_link.merge({ last_step: 'results' })
    @link_for_emotion  = @general_link.merge({ emotion_id: nil, last_step: 'meme-selection' })
    @view_complete_by = range_format(time_period)
    @emotions = Emotion.positive.sample(NUMBER_OF_ELEMENTS) +
                Emotion.neutral.sample(NUMBER_OF_ELEMENTS) +
                Emotion.negative.sample(NUMBER_OF_ELEMENTS)
    @table = []
    (0..@emotions.length - 1).each { |i| @table.push(@emotions[(i - (6 * (i / 6).ceil - 1)) * 6 - ((i / 6).ceil - 1) - 2]) }
    mail(to: user.email, subject: "Hey #{@user.first_name}, how was your week?")
  end

  private

  def range_format(date)
    "#{date.end_date.strftime('%d')} #{date.end_date.strftime('%b')}"
  end
end
