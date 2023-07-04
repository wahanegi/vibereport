class Api::V1::UsersController < ApplicationController
  include ApplicationHelper
  before_action :require_user!

  def update
    if current_user.update!(user_params)
      render json: { success: true }
    else
      render json: { error: current_user.errors.messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:not_ask_visibility)
  end
end
