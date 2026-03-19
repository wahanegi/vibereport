# frozen_string_literal: true

class Api::V1::ResponseFlowFromEmail
  attr_reader :user, :time_period_id, :emotion_id, :last_step, :not_working, :completed_at

  def initialize(user, time_period_id:, last_step: nil, not_working: false, emotion_id: nil, completed_at: nil)
    @user = user
    @time_period_id = time_period_id
    @emotion_id = emotion_id
    @not_working = not_working
    @last_step = last_step
    @completed_at = completed_at
  end

  def call
    existed_response
    if @existed_response.present?
      update_response!
      { success: true, response: @existed_response }
    else
      create_response!
      { success: true, response: @new_response }
    end
  rescue StandardError => e
    { success: false, error: e }
  end

  private

  def create_response!
    @new_response = user.responses.create!(time_period_id:, emotion_id:, not_working:, steps:)
  end

  def update_response!
    return @existed_response if response_with_emotion?

    notify_user if response_not_working?
  end

  def existed_response
    @existed_response ||= Response.find_by(time_period_id:, user_id: user.id)
  end

  def steps
    steps = %w[emotion-selection-web]
    case last_step
    when 'emotion-entry'
      steps << 'emotion-entry'
    when 'results'
      steps << 'results'
    when 'rather-not-say'
      steps << 'rather-not-say'
    when 'emotion-type'
      steps << 'emotion-type'
    else
      steps
    end
  end

  def response_with_emotion?
    @existed_response.emotion.present?
  end

  def response_not_working?
    @existed_response.not_working && last_step != 'results'
  end

  def notify_user
    @existed_response.update!(notices: { alert: 'Did you work during this </br>check-in period?', last_step:, emotion_id: })
  end
end
