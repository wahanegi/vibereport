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
    @view_complete_by  = time_period.due_date.strftime('%b %d').to_s
    @table = []
    emotions = Emotion.positive.sample(NUMBER) + Emotion.neutral.sample(NUMBER) + Emotion.negative.sample(NUMBER)
    emotions.each_slice(6) { |sliced_emotions| @table << sliced_emotions }
    @table = @table.transpose.flatten
    mail(to: user.email, subject: "Hey #{user.first_name}, how was your week?")
  end

  def results_email(user, time_period, words)
    general_link = api_v1_see_the_results_url(time_period_id: time_period.id, user_id: user.id, not_working: false)
    uri = URI.parse(general_link)
    query_params = URI.decode_www_form(uri.query || '') << ['last_step', 'results']
    uri.query = URI.encode_www_form(query_params)
    
    @link_see_the_results = uri.to_s 
    @view_calendar_days = "#{time_period.start_date.strftime('%d %b.')} \n – \n#{time_period.end_date.strftime('%d %b.')}"
    @user = user
    @time_period = time_period
    @words = words
    mail(to: @user.email, subject: "Hey #{user.first_name}, the results are in!")
  end

  def range_format(date)
    "#{date.start_date.strftime('%d')}-#{date.end_date.strftime('%d')} #{date.end_date.strftime('%b')}"
  end
end
