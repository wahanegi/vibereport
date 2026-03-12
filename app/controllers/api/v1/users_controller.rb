class Api::V1::UsersController < ApplicationController
  include LegacyEmailLinkSupport
  include ActionView::Helpers::SanitizeHelper
  include ActionView::Helpers::OutputSafetyHelper
  before_action :authenticate_user!, only: %i[update]

  def update
    if current_user.update!(user_params)
      render json: { current_user: }
    else
      render json: { error: current_user.errors.messages }, status: :unprocessable_entity
    end
  end

  def unsubscribe
    payload = SignedLinks::UnsubscribeBuilder.verify(params[:token])
    # TODO: Remove next line after LEGACY_EMAIL_LINKS_CUTOFF_DATE passes.
    payload ||= legacy_unsubscribe_payload if legacy_links_allowed?
    return redirect_to(new_user_session_path, alert: 'Invalid or expired link') if payload.blank?

    @user = User.find_by(id: payload[:user_id].to_i)
    return redirect_to(new_user_session_path, alert: 'Invalid or expired link') if @user.blank?

    sign_in @user
    redirect_to '/unsubscribe'
  end

  private

  def user_params
    params.require(:user).permit(:not_ask_visibility, :opt_out, :time_period_index)
  end

  def user
    @user ||= User.find_by(id: params[:user_id])
  end

  # TODO: Remove after LEGACY_EMAIL_LINKS_CUTOFF_DATE passes.
  def legacy_unsubscribe_payload
    return if params[:user_id].blank?

    { user_id: params[:user_id].to_i }.with_indifferent_access
  end
end
