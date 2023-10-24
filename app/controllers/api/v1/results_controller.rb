class Api::V1::ResultsController < ApplicationController
  before_action :authenticate_user!, :time_period, only: %i[show]

  def show
    if @time_period.present?
      render json: Api::V1::ResultsPresenter.new(@time_period.slug, current_user, request.original_url).json_hash
    else
      render json: { error: 'Time period not found' }, status: :not_found
    end
  end

  def results_email
    sign_in user
    msg = results_email_error_message
    update_user_time_index
    return redirect_to "/results/#{params[:slug]}" if msg.blank?

    render json: { error: msg }, status: :unprocessable_entity
  end

  private

  def results_email_error_message
    return 'Time period not found' if time_period.blank?
    return 'No responses found' if time_period.responses.blank?

    ''
  end

  def time_period
    @time_period ||= TimePeriod.find_by(slug: params[:slug])
  end

  def user
    @user ||= User.find_by(id: params[:user_id])
  end

  def current_response
    @current_response ||= current_user.responses.find_by(time_period_id: TimePeriod.current.id)
  end

  def time_periods
    @time_periods ||= TimePeriod.ordered
  end

  def update_user_time_index
    requested_time_period = time_periods.find_by(slug: params[:slug])
    index = time_periods.index(requested_time_period)
    user.update!(time_period_index: index)
  end
end
