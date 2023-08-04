# frozen_string_literal: true

# Generate email letter CI-32
class UserEmailMailer < ApplicationMailer
  include UserEmailMailerHelper
  default from: "#{ENV.fetch('DEFAULT_FROM_ADDRESS')}@#{ENV.fetch('EMAIL_DOMAIN')}"
  NUMBER = Emotion::SHOW_NUMBER_PER_CATEGORY
  URL = { controller: 'api/v1/responses', action: 'response_flow_from_email' }.freeze

  def response_invite(user, time_period)
    @user = user
    general_link = URL.merge({ time_period_id: TimePeriod.current, not_working: false, user_id: user.id })
    @link_for_own_word = general_link.merge({ last_step: 'emotion-entry' })
    @link_for_was_not  = general_link.merge({ last_step: 'results' })
    @link_for_not_say  = general_link.merge({ last_step: 'rather-not-say' })
    @link_for_emotion  = general_link.merge({ emotion_id: nil, last_step: 'emotion-type' })
    @view_complete_by  = time_period.due_date.strftime('%b %d').to_s
    @table = emotions_table
    mail(to: user.email, subject: "Hey #{user.first_name}, how has work been?")
  end

  def results_email(user, time_period, words)
    @user = user
    @time_period = time_period
    @words = words
    mail(to: @user.email, subject: "Hey #{user.first_name}, the results are in!")
  end

  def reminder_email(user, response, time_period)
    @response = response
    @user = user
    @time_period = time_period
    mail(to: user.email, subject: "#{user.first_name}, your check-in was saved.")
  end
end
