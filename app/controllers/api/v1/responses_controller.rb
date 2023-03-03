# frozen_string_literal: true

class Api::V1::ResponsesController < ApplicationController
  NUMBER_OF_ELEMENTS = Emotion::SHOW_NUMBER_PER_CATEGORY
  def index
    three_set = []
    three_set.concat(Emotion.positive.sample(NUMBER_OF_ELEMENTS))
    three_set.concat(Emotion.neutral.sample(NUMBER_OF_ELEMENTS))
    three_set.concat(Emotion.negative.sample(NUMBER_OF_ELEMENTS))

    render json: EmotionSerializer.new(three_set) , status: :ok
  end


end
