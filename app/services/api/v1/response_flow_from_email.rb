class Api::V1::ResponseFlowFromEmail
  attr_reader :params, :user, :time_period_id, :emotion_id

  def initialize(params, user)
    @params = params
    @user = user
    @time_period_id = params[:time_period_id]
    @emotion_id = params[:emotion_id]
  end

  def call
    set_existed_response
    if @existed_response.present?
      update_response
      { success: true, response: @existed_response }
    else
      create_response
      { success: true, response: @new_response }
    end
  rescue StandardError => e
    { success: false, error: e }
  end

  private

  def create_response
    @new_response = user.responses.create!(time_period_id: time_period_id, emotion_id: emotion_id, steps: "[\"emotion-selection-web\",\"meme-selection\"]")
  end

  def update_response
    @existed_response.update!(emotion_id: emotion_id, not_working: false, steps: "[\"emotion-selection-web\",\"meme-selection\"]")
  end

  def set_existed_response
    @existed_response ||= Response.find_by(time_period_id: time_period_id, user_id: user.id)
  end
end
