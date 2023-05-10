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
    emotion_existed = Emotion.find_by(word: params.dig('emotion', 'word'))

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
      current_user:,
      time_period:,
      response: @current_response ? response_hash : { attributes: { steps: %w[emotion-selection-web].to_s } },
      emotion: @current_response ? @current_response.emotion : {},
      api_giphy_key: ENV['GIPHY_API_KEY'].presence,
      users: User.ordered.map do |user|
        { id: user.id, display: user.first_name, first_name: user.first_name, last_name: user.last_name }
      end,
      user_shoutouts: current_user.shoutouts
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

  def fun_question
    custom_question.presence || FunQuestion.question_public.not_used.sample
  end

  def custom_question
    current_fun_question = FunQuestion.find_by(time_period_id: TimePeriod.current.id)
    @fun_question ||= current_fun_question || FunQuestion.question_public.not_used.where.not(user_id: nil).first
    return nil if @fun_question.blank?

    {
      id: @fun_question.id,
      user_id: @fun_question.user&.id,
      user_name: @fun_question.user&.first_name,
      question_body: @fun_question.question_body
    }
  end

  def time_period
    @time_period ||= TimePeriod.find_or_create_time_period
  end
end
