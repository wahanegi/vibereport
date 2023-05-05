require 'digest'

class Api::V1::ShoutoutsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!

  ERROR_1 = 'Content shout out is exist!'.freeze

  def create
    @shoutout = Shoutout.new(shoutout_params)

    return unless @shoutout[:user_id] == current_user.id

    if Shoutout.exists?(digest: shoutout_params[:digest])
      render json: { error: ERROR_1 }, status: :unprocessable_entity

    elsif @shoutout.save
      RecipientShoutout.create(records_recipients(@shoutout)) if @shoutout[:recipients].length.positive?

      render json: @shoutout, status: :ok
    else
      render json: { error: @shoutout[:errors] }, status: :unprocessable_entity
    end
end

  def update

    @shoutout = Shoutout.find(params[:id])

    return unless @shoutout[:user_id] == current_user.id

    if Shoutout.exists?(digest: shoutout_params[:digest])
      render json: { error: ERROR_1 }, status: :unprocessable_entity

    elsif @shoutout.update(shoutout_params)

      if @shoutout[:recipients].length.positive?
        RecipientShoutout.where(shoutout_id: @shoutout.id).destroy_all
        RecipientShoutout.create(records_recipients(@shoutout))
      end

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

  def records_recipients( shoutout )

    return { user_id: shoutout[:recipients][0].to_i, shoutout_id: shoutout[:id] } if shoutout[:recipients].length == 1

    shoutout[:recipients].map { |user_id| { user_id: user_id.to_i, shoutout_id: shoutout.id } }

  end
end
