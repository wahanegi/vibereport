class Api::V1::UsersController < ApplicationController
  include ApplicationHelper
  before_action :require_user!, only: %i[update]

  def update
    if current_user.update!(user_params)
      render json: { success: true }
    else
      render json: { error: current_user.errors.messages }, status: :unprocessable_entity
    end
  end

  def unsubscribe
    return redirect_to '/unsubscribe' if sign_in(user)

    render json: { error: 'Not sign in user' }, status: :unprocessable_entity
  end

  private

  def user_params
    params.require(:user).permit(:not_ask_visibility, :opt_out)
  end

  def user
    @user ||= User.find_by(id: params[:user_id])
  end
end
