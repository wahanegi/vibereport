class Api::V1::ResponsesController < ApplicationController
  include ApplicationHelper

  protect_from_forgery with: :null_session
  before_action :set_response, only: [:show]
  before_action :require_user!

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

  private

  def set_response
    @response = Response.find(params[:id])
  end

  def response_params
    params.require(:response).permit(:emotion_id, :time_period_id)
  end

  def additional_params
    {
      emotion: @response.emotion
    }
  end
end
