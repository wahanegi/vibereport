class Api::V1::ResultsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!, :time_period, only: %i[show]

  def show
    if @time_period.present?
      render json: Api::V1::ResultsPresenter.new(@time_period.id, current_user).json_hash
    else
      render json: { error: 'Time period not found' }, status: :not_found
    end
  end

  def results_email
    sign_in user
    msg = results_email_error_message
    return redirect_to "/results?id=#{params[:id]}" if msg.blank?

    render json: { error: msg }, status: :unprocessable_entity
  end

  private

  def results_email_error_message
    return 'Time period not found' if time_period.blank?
    return 'No responses found' if time_period.responses.blank?

    ''
  end

  def time_period
    @time_period ||= TimePeriod.find_by(id: params[:id])
  end

  def user
    @user ||= User.find_by(id: params[:user_id])
  end

  def current_response
    @current_response ||= current_user.responses.find_by(time_period_id: TimePeriod.current.id)
  end
end
