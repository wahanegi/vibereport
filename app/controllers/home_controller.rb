class HomeController < ApplicationController
  include ApplicationHelper
  before_action :require_user!, only: :app

  def index
    return redirect_to app_path if current_user.present?
    return redirect_to auth.sign_in_path, flash: { error: 'Expired!' } if session_expired?

    redirect_to auth.sign_in_path
  end

  def app; end
end
