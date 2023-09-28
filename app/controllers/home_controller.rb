class HomeController < ApplicationController
  include ApplicationHelper
  before_action :authenticate_user!, only: :app

  def index
    return redirect_to app_path if current_user.present?

    redirect_to new_user_session_path
  end

  def app; end
end
