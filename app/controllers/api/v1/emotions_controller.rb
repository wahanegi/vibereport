class Api::V1::EmotionsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!

  NUMBER_OF_ELEMENTS = Emotion::SHOW_NUMBER_PER_CATEGORY
  def index

    three_set = []
    three_set.concat(Emotion.positive.sample(NUMBER_OF_ELEMENTS))
    three_set.concat(Emotion.neutral.sample(NUMBER_OF_ELEMENTS))
    three_set.concat(Emotion.negative.sample(NUMBER_OF_ELEMENTS))
    if current_user.present?
      render json:EmotionSerializer.new(three_set).serializable_hash.merge(additional_params), status: :ok
    else
      render json: {}, status: 401
    end
  end

  private

  def additional_params
    {
      current_user_id: current_user.id,
      time_period: TimePeriod.current
    }
  end
end
