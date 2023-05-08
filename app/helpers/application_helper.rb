module ApplicationHelper
  include Passwordless::ControllerHelpers

  private

  def current_user
    @current_user ||= authenticate_by_session(User)
  end

  def require_user!
    return if current_user

    redirect_to root_path, flash: { error: 'Sorry, you should try logging in again!' }
  end

  def session_expired?
    passwordless_session_id = session.to_h['passwordless_session_id--user']
    passwordless_session = Passwordless::Session.find_by(id: passwordless_session_id)
    return false if passwordless_session.blank?

    passwordless_session.expires_at <= Time.current
  end

  def digital_signature_to_prevent_duplication(row)
    row_sum = 0
    [row[:user_id], row[:time_period_id], row[:rich_text], row[:recipients]].each do |field|
        digest = Digest::SHA1.hexdigest(field.to_s)
      row_sum += digest.to_i(16)
    end
    row_sum.to_s.slice(0, 16).to_i
  end
end
