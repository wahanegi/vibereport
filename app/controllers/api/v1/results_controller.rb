class Api::V1::ResultsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!, :time_period, only: %i[show]

  def show
    render json: Api::V1::ResultsPresenter.new(@time_period.id, current_user).json_hash
  end

  def see_results
    sign_in(user)
    time_period
    msg = 'Time period not found' unless time_period
    if time_period.present?
      @responses = Response.joins(:time_period)
                           .where(time_period_id: @time_period.id)
                           .where('time_periods.end_date <= ?', Date.current)
      msg ||= 'No responses found' if @responses.blank?
    end
    render json: { error: msg }, status: :unprocessable_entity
  end

  private

  def time_period
    @time_period ||= TimePeriod.find_by(id: params[:id])
  end

  def user
    @user ||= User.find_by(id: params[:user_id])
  end
end
