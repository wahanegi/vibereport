require 'digest'

class Api::V1::ShoutoutsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!

  def create
    # @shoutout = Shoutout.new(shoutout_params)
    @shoutout = current_user.shoutouts.new(shoutout_params)
    if @shoutout.save
      create_shoutout_recipients unless @shoutout.recipients.empty?
      render json: @shoutout, status: :ok
    else
      render json: { error: @shoutout.errors.messages }, status: :unprocessable_entity
    end
end

  def update
    @shoutout = Shoutout.find_by(id: params[:id])
    if @shoutout.update(shoutout_params)
      update_shoutout_recipients
      render json: @shoutout, status: :ok
    else
      render json: { error: @shoutout.errors.messages }, status: :unprocessable_entity
    end
  end

  private

  def shoutout_params
    parameters = params.require(:shoutout).permit( :time_period_id, :rich_text, [recipients: []])
    parameters.merge({ 'digest' => digital_signature_to_prevent_duplication(parameters) })
  end

  def create_shoutout_recipients
    shoutout_params['recipients'].each do |recipient_id|
      current_user.shoutout_recipients.create(user_id: recipient_id, shoutout_id: @shoutout.id)
    end
  end

  def update_shoutout_recipients
    return if @shoutout.recipients.empty?

    @shoutout.shoutout_recipients.destroy_all
    create_shoutout_recipients
  end

end
