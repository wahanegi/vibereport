class Api::V1::UsersController < ApplicationController
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
    return redirect_to '/unsubscribe' if sign_in(user)

    render json: { error: 'Not sign in user' }, status: :unprocessable_entity
  end

  def send_reminder
    @user = User.find(params[:id])
    message = build_message
    UserEmailMailer.send_reminder(@user, message).deliver_now
    redirect_to admin_dashboard_path, notice: "Reminder sent to #{@user.full_name}"
  end

  private

  def user_params
    params.require(:user).permit(:not_ask_visibility, :opt_out, :time_period_index)
  end

  def user
    @user ||= User.find_by(id: params[:user_id])
  end

  def build_message
    general_link = url_for(URL.merge({ time_period_id: TimePeriod.current.id, user_id: @user.id }))
    link_text = "<a href='#{general_link}'>Link here</a>"
    params['reminder_message'].present? && message = params['reminder_message'][@user.id.to_s]
    base_message = 'Hi 👋 '.html_safe + sanitize(@user.first_name) + ', please enter your Vibereport check-in 📝 for last week: '.html_safe
    message || safe_join([base_message, sanitize(link_text), '. Thanks! 😊'.html_safe])
  end
end
