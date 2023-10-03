# frozen_string_literal: true

# Generate email letter CI-32
class UserEmailMailer < ApplicationMailer
  include UserEmailMailerHelper
  default from: "#{ENV.fetch('DEFAULT_FROM_ADDRESS')}@#{ENV.fetch('EMAIL_DOMAIN')}"
  NUMBER = Emotion::SHOW_NUMBER_PER_CATEGORY
  URL = { controller: 'api/v1/responses', action: 'response_flow_from_email' }.freeze

  def response_invite(user, time_period)
    @user = user
    general_link = URL.merge({ time_period_id: TimePeriod.current, user_id: user.id })
    @link_for_own_word = general_link.merge({ last_step: 'emotion-entry', not_working: false })
    @link_for_was_not  = general_link.merge({ last_step: 'results', not_working: true })
    @link_for_not_say  = general_link.merge({ last_step: 'rather-not-say', not_working: false, completed_at: nil })
    @link_for_emotion  = general_link.merge({ emotion_id: nil, last_step: 'emotion-type', not_working: false })
    @view_complete_by  = time_period.due_date.strftime('%b %d').to_s
    @table = emotions_table
    mail(to: user.email, subject: "Hey #{user.first_name}, how has work been?")
  end

  def results_email(user, time_period)
    @user = user
    @time_period = time_period
    mail(to: @user.email, subject: "Hey #{user.first_name}, the results are in!")
  end

  def reminder_email(user, response, time_period)
    @response = response
    @user = user
    @time_period = time_period
    mail(to: user.email, subject: "#{user.first_name}, your check-in was saved.")
  end

  def send_reminder(user, message)
    @user = user
    @message = message
    mail(to: @user.email, subject: '🔔 Reminder: Share Your Vibes from Last Week')
  end
end
