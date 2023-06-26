class Api::V1::NotificationsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!, only: %i[create]

  def create
    @notification = current_user.notifications.build(notification_params)
    if @notification.save
      render json: { callback: 'success' }
    else
      render json: { error: @notification.errors }, status: :unprocessable_entity
    end
  end

  private

  def notification_params
    params.require(:notification).permit(:details)
  end
end
