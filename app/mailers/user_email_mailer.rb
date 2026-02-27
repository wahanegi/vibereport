# frozen_string_literal: true

# Generate email letter CI-32
class UserEmailMailer < ApplicationMailer
  include UserEmailMailerHelper

  NUMBER = Emotion::SHOW_NUMBER_PER_CATEGORY

  def response_invite(user, time_period)
    @user = user
    @link_for_own_word = SignedLinks::ResponseFlowBuilder.url(user, time_period, last_step: 'emotion-entry',
                                                                                 not_working: false)
    @link_for_was_not = SignedLinks::ResponseFlowBuilder.url(user, time_period, last_step: 'results', not_working: true)
    @link_for_not_say = SignedLinks::ResponseFlowBuilder.url(user, time_period, last_step: 'rather-not-say',
                                                                                not_working: false, completed_at: nil)
    @table = emotions_table
    @emotion_links = @table.to_h do |cell|
      [cell.id, SignedLinks::ResponseFlowBuilder.url_for_emotion(user, time_period, cell.id)]
    end
    @url_sign_in_from_email = SignedLinks::SignInFromEmailBuilder.url(user, time_period: time_period)
    @url_unsubscribe = SignedLinks::UnsubscribeBuilder.url(user)
    @view_complete_by = time_period.due_date.strftime('%b %d').to_s
    mail(to: user.email, subject: "Hey #{user.first_name}, how has work been?")
  end

  def results_email(user, time_period, fun_question)
    @user = user
    @time_period = time_period
    @fun_question = fun_question
    @url_results = SignedLinks::ResultsEmailBuilder.url(user, time_period)

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
    @url_sign_in_from_email = SignedLinks::SignInFromEmailBuilder.url(user, time_period: time_period)
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
    @url_sign_in_from_email = SignedLinks::SignInFromEmailBuilder.url(user, time_period: time_period)
    @fun_question = time_period.fun_question
    @fun_question_responses = @fun_question&.fun_question_answers&.limit(3) || []
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
    @missing_periods = Array(missing_periods).sort_by(&:due_date)
    @links = @missing_periods.map do |period|
      { period: period, url: SignedLinks::DirectTimesheetEntryBuilder.call(user, period) }
    end
    @intro_message = 'You are required to fill out your timesheet for past periods. Please complete it as soon as possible.'

    mail(to: @user.email, subject: 'Action Required: Overdue Timesheet(s)')
  end

  private

  def user_belongs_to_timesheet_team?
    @user.teams.exists?(timesheet_enabled: true)
  end
end
