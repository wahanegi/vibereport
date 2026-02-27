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
    payload = SignedLinks::ResultsEmailBuilder.verify(params[:token])
    return redirect_to_invalid_link if payload.blank?

    @user = User.find_by(id: payload[:user_id].to_i)
    @time_period = TimePeriod.find_by(slug: payload[:time_period_slug])
    return redirect_to_invalid_link if @user.blank? || @time_period.blank?

    sign_in @user
    msg = results_email_error_message
    update_user_time_index
    return redirect_to "/results/#{@time_period.slug}" if msg.blank?

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
    requested_time_period = time_periods.find_by(slug: @time_period.slug)
    index = time_periods.index(requested_time_period)
    @user.update!(time_period_index: index)
  end

  def redirect_to_invalid_link
    redirect_to new_user_session_path, alert: 'Invalid or expired link'
  end
end
