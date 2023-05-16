class Api::V1::ResultsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!, :time_period, only: %i[show]

  def show
    render json: Api::V1::ResultsPresenter.new(@time_period.id, current_user).json_hash
  end

  def results_email
    sign_in_user
    msg = time_period.present? ? '' : 'Time period not found'
    msg ||= 'No responses found' if time_period.present? && time_period.responses.blank?
    steps = current_response.steps << 'results'
    current_response.update(steps:)
    return redirect_to "/results?id=#{params[:id]}" if msg.blank?

    render json: { error: msg }, status: :unprocessable_entity
  end

  private

  def time_period
    @time_period ||= TimePeriod.find_by(id: params[:id])
  end

  def user
    @user ||= User.find_by(id: params[:user_id])
  end

  def sign_in_user
    sign_in user
  end

  def current_response
    @current_response ||= Response.find_by(time_period_id: TimePeriod.current.id, user_id: current_user.id)
  end
end
