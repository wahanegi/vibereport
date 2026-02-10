# frozen_string_literal: true

# Generate email letter CI-32
class UserEmailMailer < ApplicationMailer
  include UserEmailMailerHelper

  NUMBER = Emotion::SHOW_NUMBER_PER_CATEGORY
  URL = { controller: 'api/v1/responses', action: 'response_flow_from_email' }.freeze

  def response_invite(user, time_period)
    @user = user
    general_link = URL.merge({ time_period_id: TimePeriod.current, user_id: user.id })
    @link_for_own_word = general_link.merge({ last_step: 'emotion-entry', not_working: false })
    @link_for_was_not = general_link.merge({ last_step: 'results', not_working: true })
    @link_for_not_say = general_link.merge({ last_step: 'rather-not-say', not_working: false, completed_at: nil })
    @link_for_emotion = general_link.merge({ emotion_id: nil, last_step: 'emotion-type', not_working: false })
    @view_complete_by = time_period.due_date.strftime('%b %d').to_s
    @table = emotions_table
    mail(to: user.email, subject: "Hey #{user.first_name}, how has work been?")
  end

  def results_email(user, time_period, fun_question)
    @user = user
    @time_period = time_period
    @fun_question = fun_question

    content = ResultsContent.new(user, time_period, fun_question)

    subject = content.subject
    @main_header = content.main_header
    @sub_header = content.sub_header

    mail(to: @user.email, subject:)
  end

  def reminder_email(user, response, time_period)
    @response = response
    @user = user
    @time_period = time_period
    mail(to: user.email, subject: "#{user.first_name}, your check-in was saved.")
  end

  def send_reminder(user, general_link)
    @user = user
    @general_link = general_link
    mail(to: @user.email, subject: '🔔 Reminder: Share Your Vibes from Last Week')
  end

  def auto_remind_checkin(user, time_period)
    @user = user
    @time_period = time_period
    @fun_question = time_period.fun_question
    @fun_question_responses = @fun_question.fun_question_answers.limit(3)
    @shout_outs = user.mentions.where(time_period_id: time_period.id)

    if user_belongs_to_timesheet_team?
      subject = 'Timesheets due Today'
      @message_above_button = 'You are required to fill out your timesheet for last week. Please enter it now.'
    else
      subject = random_remind_checkin_subject(time_period)
      @message_above_button = who_is_waiting(user, time_period)
    end

    mail(to: @user.email, subject: subject)
  end

  def daily_timesheet_reminder(user, missing_periods)
    @user = user
    @missing_periods = Array(missing_periods)
    @intro_message = 'You are required to fill out your timesheet for past periods. Please complete it as soon as possible.'

    # TODO: Replace with a proper deep link to the timesheet entry UI once frontend routing is finalized.
    @timesheet_base_url = app_url

    mail(to: @user.email, subject: 'Reminder: Please Complete Your Overdue Timesheets')
  end

  private

  def user_belongs_to_timesheet_team?
    @user.teams.exists?(timesheet_enabled: true)
  end
end
