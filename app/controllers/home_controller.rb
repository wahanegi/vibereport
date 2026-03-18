class HomeController < ApplicationController
  include ApplicationHelper
  before_action :authenticate_user!, only: :app

  def index
    return redirect_to app_path if current_user.present?

    redirect_to new_user_session_path
  end

  def app
    return if flash[:from_direct_entry]

    period_id = session[:direct_timesheet_time_period_id]
    return unless period_id.present? && TimeSheetEntry.exists?(user_id: current_user.id, time_period_id: period_id)

    session.delete(:direct_timesheet_time_period_id)
  end

  def sent
    @email = flash[:email]

    redirect_to root_path unless @email
  end
end
