class Api::V1::ResponsesController < ApplicationController
  include ApplicationHelper

  before_action :set_response, only: %i[show update]
  before_action :require_user!, only: [:index, :show, :create, :update]
  skip_before_action :verify_authenticity_token, only: [:response_flow_from_email]

  def index
    render json: ResponseSerializer.new(Response.all).serializable_hash
  end

  def show
    render json: ResponseSerializer.new(@response).serializable_hash.merge(additional_params)
  end

  def create
    @response = current_user.responses.build(response_params)

    if @response.save
      render json: ResponseSerializer.new(@response).serializable_hash
    else
      render json: {error: @response.errors }, status: 422
    end
  end

  def update
    if @response.update(response_params)
      render json: ResponseSerializer.new(@response).serializable_hash
    else
      render json: {error: @response.errors }, status: 422
    end
  end

  def response_flow_from_email
    user = User.find_by(id: params[:user_id])
    new_response = user.responses.build(time_period_id: params[:time_period_id],
                                        emotion_id: params[:emotion_id],
                                        step: 'MemeSelection')
    sign_in user
    existed_response ||= Response.find_by(time_period_id: params[:time_period_id], user_id: user.id)
    if existed_response.present?
      existed_response.update(emotion_id: params[:emotion_id])

      redirect_to "/responses/#{existed_response.id}"
    else
      new_response.save

      redirect_to "/responses/#{new_response.id}"
    end
  end

  private

  def set_response
    @response = Response.find(params[:id])
  end

  def response_params
    params.require(:response).permit(:id, :emotion_id, :time_period_id, :step, :word, :category)
  end

  def additional_params
    {
      emotion: @response.emotion
    }
  end
end
