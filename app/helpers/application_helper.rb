module ApplicationHelper
  include Passwordless::ControllerHelpers

  private

  def current_user
    @current_user ||= authenticate_by_session(User)
  end

  def require_user!
    return if current_user

    redirect_to root_path, flash: { error: 'You are not worthy!' }
  end
end
