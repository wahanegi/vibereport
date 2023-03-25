class Api::V1::ResponseFlowFromEmail
  attr_reader :params, :user, :time_period_id, :emotion_id, :last_step, :not_working

  def initialize(params, user)
    @params = params
    @user = user
    @time_period_id = params[:time_period_id]
    @emotion_id = params[:emotion_id]
    @not_working = params[:not_working]
    @last_step = params[:last_step]
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
    when 'meme-selection'
      steps << 'meme-selection'
    when 'results'
      steps << 'results'
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
