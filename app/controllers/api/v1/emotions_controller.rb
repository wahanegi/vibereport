class Api::V1::EmotionsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!
  before_action :set_current_response, only: [:index]

  NUMBER_OF_ELEMENTS = Emotion::SHOW_NUMBER_PER_CATEGORY
  def index
    three_set = build_three_set
    if current_user.present?
      render json: EmotionSerializer.new(three_set).serializable_hash.merge(additional_params), status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end

  private

  def additional_params
    #  below in the response steps must be wrote with only such format in other case will be mistakes
    {
      current_user_id: current_user.id,
      time_period: {
        id: TimePeriod.current.id,
        start_date: TimePeriod.current.start_date,
        end_date: TimePeriod.current.end_date
      },
      response: @current_response ? response_hash : { attributes: { steps: %w[emotion-selection-web].to_s } },
      emotion: @current_response ? Emotion.find_by(id: @current_response.emotion_id) : '{}'
    }
  end

  def set_current_response
    @current_response ||= Response.find_by(time_period_id: TimePeriod.current.id, user_id: current_user.id)
  end

  def response_hash
    {
      id: @current_response.id,
      type: 'response',
      attributes: @current_response
    }
  end

  def build_three_set
    Emotion.positive.sample(NUMBER_OF_ELEMENTS) +
      Emotion.neutral.sample(NUMBER_OF_ELEMENTS) +
      Emotion.negative.sample(NUMBER_OF_ELEMENTS)
  end
end