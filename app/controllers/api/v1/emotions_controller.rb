class Api::V1::EmotionsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!
  before_action :current_response, only: [:index]

  NUMBER_OF_ELEMENTS = Emotion::SHOW_NUMBER_PER_CATEGORY
  def index
    three_set = build_three_set
    if current_user.present?
      render json: EmotionSerializer.new(three_set).serializable_hash.merge(additional_params), status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end

  def create
    emotion = Emotion.new(emotion_params)
    emotion_existed = Emotion.all.find_by(word: params.dig('emotion', 'word'))

    if emotion_existed.present?
      render json: EmotionSerializer.new(emotion_existed).serializable_hash
    elsif emotion.save
      render json: EmotionSerializer.new(emotion).serializable_hash
    else
      render json: { error: emotion.errors }, status: :unprocessable_entity
    end
  end

  def all_emotions
    if current_user.present?
      render json: EmotionSerializer.new(Emotion.all).serializable_hash, status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end

  private

  def additional_params
    #  below in the response steps must be wrote with only such format in other case will be mistakes
    {
      current_user_id: current_user.id,
      time_period:,
      response: @current_response ? response_hash : { attributes: { steps: %w[emotion-selection-web].to_s } },
      emotion: @current_response ? @current_response.emotion : {},
      api_giphy_key: ENV['GIPHY_API_KEY'].presence,
      users: User.ordered.map do |user|
        { id: user.id, display: user.first_name, first_name: user.first_name, last_name: user.last_name }
      end,
      my_shout_outs_to_other: Shoutout.find_by(user_id: current_user.id),
      other_shout_outs_to_me: list_shoutouts_to(current_user)
    }
  end

  def current_response
    @current_response ||= Response.find_by(time_period_id: time_period.id, user_id: current_user.id)
  end

  def response_hash
    {
      id: @current_response.id,
      type: 'response',
      attributes: @current_response
    }
  end

  def build_three_set
    Emotion.emotion_public.positive.sample(NUMBER_OF_ELEMENTS) +
      Emotion.emotion_public.neutral.sample(NUMBER_OF_ELEMENTS) +
      Emotion.emotion_public.negative.sample(NUMBER_OF_ELEMENTS)
  end

  def emotion_params
    params.require(:emotion).permit(:word, :category)
  end

  def time_period
    @time_period ||= TimePeriod.find_or_create_time_period
  end
  
  def list_shoutouts_to(user)
    list_ids_shot_outs = RecipientShoutout.find_by(user_id: user.id)
    return {} if list_ids_shot_outs.nil?
    return Shoutout.find(list_ids_shot_outs.shoutout_id) if list_ids_shot_outs.length == 1

    list_ids_shot_outs.map { |item| Shoutout.find(item.shoutout_id) }
  end
end
