require 'digest'

class Api::V1::ShoutoutsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!


  def create
    @shoutout = Shoutout.new(shoutout_params)

    return unless @shoutout[:user_id] == current_user.id

    if !Shoutout.exists?(digest: @shoutout.digest) && @shoutout.save
      debugger
    if @shoutout[:recipients].length.positive?
      RecipientShoutout.save(create_records_recipients @shoutout)
    end

      render json: @shoutout, status: :ok
    else
      render json: { error: @shoutout[:errors] }, status: :unprocessable_entity
    end
  end

  def update
    @shoutout = Shoutout.find(params[:id])

    return unless @shoutout[:user_id] == current_user.id

    if !Shoutout.exists?(digest: shoutout_params[:digest]) && @shoutout.update(shoutout_params)
      render json: @shoutout, status: :ok
    else
      render json: { error: @shoutout[:errors] }, status: :unprocessable_entity
    end
  end

  private

  def shoutout_params
    parameters = params.require(:shoutout).permit(:user_id, :time_period_id, :rich_text, [recipients: []])
    parameters.merge({ 'digest' => digest_fields(parameters) })
  end

  def create_records_recipients( shoutout )
    records = []
    return [{ user_id: shoutout[:user_id].to_i, id: shoutout.id }] if shoutout[:recipients].length == 1

    shoutout[:recipients].each { |user_id| records.push ({ user_id: user_id.to_i, id: shoutout.id }) }
    records
  end
end
