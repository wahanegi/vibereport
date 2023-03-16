class Api::V1::ResponseNotWorkingFromEmail < Api::V1::ResponseFlowFromEmail
  def call
    set_existed_response
    @existed_response.present? ? update_response : create_response
    { success: true }
  rescue StandardError => e
    { success: false, error: e }
  end

  private

  def create_response
    user.responses.create!(time_period_id: time_period_id, not_working: true, steps: '', emotion_id: nil)
  end

  def update_response
    @existed_response.update!(not_working: true, emotion_id: nil, steps: '')
  end
end
