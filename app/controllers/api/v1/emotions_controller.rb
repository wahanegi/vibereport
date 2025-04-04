class Api::V1::EmotionsController < ApplicationController
  include UserEmailMailerHelper
  include ApplicationHelper
  before_action :authenticate_user!
  before_action :current_response, only: [:index]

  def index
    if current_user.present?
      render json: EmotionSerializer.new(emotions_table).serializable_hash.merge(additional_params), status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end

  def create
    emotion = Emotion.new(emotion_params)
    emotion_existed = Emotion.matching_emotions(emotion_params)

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
    {
      current_user:,
      time_period: serialize_time_period(time_period),
      response: @current_response ? response_hash : { attributes: { steps: %w[emotion-selection-web].to_s } },
      emotion: @current_response ? @current_response.emotion : {},
      api_giphy_key: ENV['GIPHY_API_KEY'].presence,
      users: User.ordered.map do |user|
        {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name
        }
      end,
      fun_question:,
      user_shoutouts: current_user.shoutouts.not_celebrate,
      check_in_time_period: TimePeriod.find_by(id: session[:check_in_time_period_id]),
      has_team_access: current_user.user_teams.has_team_access.any?,
      prev_results_path:,
      time_periods: TimePeriod.ordered.map { |tp| serialize_time_period(tp) } || [],
      timesheet_enabled: current_user.teams.any?(&:timesheet_enabled?)
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

  def emotion_params
    params.require(:emotion).permit(:word, :category)
  end

  def fun_question
    fun_question = custom_question.presence || FunQuestion.question_public.not_used.sample
    return prepared_question(fun_question) if fun_question.time_period_id.present?

    fun_question.update(time_period_id: time_period.id, used: true) if fun_question.time_period_id.blank?
    prepared_question(fun_question)
  end

  def custom_question
    time_period.fun_question || FunQuestion.question_public.not_used.where.not(user_id: nil).first
  end

  def prepared_question(fun_question)
    {
      id: fun_question.id,
      user_id: fun_question.user&.id,
      user_name: fun_question.user&.first_name,
      question_body: fun_question.question_body,
      time_period_id: fun_question.time_period_id
    }
  end

  def time_period
    @time_period ||= TimePeriod.find_or_create_time_period
  end

  def serialize_time_period(time_period)
    {
      id: time_period.id,
      start_date: time_period.start_date,
      end_date: time_period.end_date,
      due_date: time_period.due_date,
      first_working_day: time_period.first_working_day,
      last_working_day: time_period.last_working_day,
      slug: time_period.slug,
      created_at: time_period.created_at,
      updated_at: time_period.updated_at
    }
  end
end
