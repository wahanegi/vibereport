require 'digest'

class Api::V1::ShoutoutsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!

  def show
    render json: ShoutoutSerializer.new(shoutout).serializable_hash
  end

  def create
    @shoutout = current_user.celebrate_shoutouts.new(shoutout_params) if params[:is_celebrate]
    @shoutout ||= current_user.shoutouts.new(shoutout_params)

    if @shoutout.save
      create_shoutout_recipients
      render json: @shoutout, status: :ok
    else
      render json: { error: @shoutout.errors.messages }, status: :unprocessable_entity
    end
  end

  def update
    if shoutout.update(shoutout_params)
      update_shoutout_recipients
      render json: shoutout, status: :ok
    else
      render json: { error: shoutout.errors.messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if shoutout.destroy
      render json: { message: 'success' }, status: :ok
    else
      render json: { error: shoutout.errors }, status: :unprocessable_entity
    end
  end

  private

  def shoutout
    @shoutout ||= Shoutout.find_by(id: params[:id])
  end

  def shoutout_params
    params.require(:shoutout).permit(:time_period_id, :rich_text)
  end

  def create_shoutout_recipients
    return if params['recipients'].blank?

    params['recipients'].each do |recipient_id|
      ShoutoutRecipient.create(user_id: recipient_id, shoutout_id: @shoutout.id)
    end
  end

  def update_shoutout_recipients
    @shoutout.shoutout_recipients.destroy_all
    create_shoutout_recipients
  end
end
