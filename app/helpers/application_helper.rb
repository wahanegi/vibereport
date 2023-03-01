module ApplicationHelper
  include Passwordless::ControllerHelpers

  private

  def current_user
    @current_user ||= authenticate_by_session(User)
  end

  def require_user!
    return if current_user

    redirect_to root_path, flash: { error: "Sorry, you should try logging in again!" }
  end

  def session_expired?
    passwordless_session_id = session.to_h['passwordless_session_id--user']
    passwordless_session = Passwordless::Session.find_by(id: passwordless_session_id)
    return false if passwordless_session.blank?

    passwordless_session.expires_at <= Time.current
  end
end
