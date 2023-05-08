require 'digest'

class Api::V1::ShoutoutsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!

  def create
    @shoutout = Shoutout.new(shoutout_params)
    if @shoutout.save
      create_shoutout_recipients unless @shoutout.recipients.empty?
      render json: @shoutout, status: :ok
    else
      render json: { error: @shoutout.errors.messages }, status: :unprocessable_entity
    end
end

  def update
    @shoutout = Shoutout.find(params[:id])
    if @shoutout.update(shoutout_params)
      update_shoutout_recipients
      render json: @shoutout, status: :ok
    else
      render json: { error: @shoutout.errors.messages }, status: :unprocessable_entity
    end
  end

  private

  def shoutout_params
    parameters = params.require(:shoutout).permit(:user_id, :time_period_id, :rich_text, [recipients: []])
    parameters.merge({ 'digest' => digital_signature_to_prevent_duplication(parameters) })
  end

  def similar_shoutout_exists?(digest)
    Shoutout.exists?(digest:)
  end

  def create_shoutout_recipients
    shoutout_params['recipients'].each do |recipient_id|
      ShoutoutRecipient.create(user_id: recipient_id, shoutout_id: @shoutout.id)
    end
  end

  def update_shoutout_recipients
    return if @shoutout.recipients.empty?

    @shoutout.shoutout_recipients.destroy_all
    create_shoutout_recipients
  end

end
