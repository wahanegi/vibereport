require 'digest'

class Api::V1::ShoutoutsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!

  CONTENT_SHOUTOUT_EXISTS_ERROR = 'A content shoutout already exists!'.freeze

  def create
    return render_error(CONTENT_SHOUTOUT_EXISTS_ERROR) if Shoutout.exists?(digest: shoutout_params[:digest])

    @shoutout = Shoutout.new(shoutout_params)
    if @shoutout.save
      create_shoutout_recipients(@shoutout) unless @shoutout[:recipients].empty?
      render json: @shoutout, status: :ok
    else
      render_error(@shoutout.errors.full_messages)
    end
end

  def update
    return render_error(CONTENT_SHOUTOUT_EXISTS_ERROR) if similar_shoutout_exists?(shoutout_params[:digest])

    @shoutout = Shoutout.find(params[:id])
    if @shoutout.update(shoutout_params)
      update_shoutout_recipients(@shoutout)
      render json: @shoutout, status: :ok
    else
      render_error(@shoutout.errors.full_messages)
    end
  end

  private

  def shoutout_params
    parameters = params.require(:shoutout).permit(:user_id, :time_period_id, :rich_text, [recipients: []])
    parameters.merge({ 'digest' => digest_fields(parameters) })
  end

  def records_recipients(shoutout)
    return { user_id: shoutout[:recipients][0].to_i, shoutout_id: shoutout[:id] } if shoutout[:recipients].length == 1

    shoutout[:recipients].map { |user_id| { user_id: user_id.to_i, shoutout_id: shoutout.id } }
  end

  def similar_shoutout_exists?(digest)
    Shoutout.exists?(digest:)
  end

  def render_error(error_message)
    render json: { error: error_message }, status: :unprocessable_entity
  end

  def create_shoutout_recipients(recipients)
    ShoutoutRecipient.create(records_recipients(recipients))
  end

  def update_shoutout_recipients(shoutout)
    return unless shoutout[:recipients].empty?

    ShoutoutRecipient.where(shoutout_id: shoutout.id).destroy_all
    create_shoutout_recipients(shoutout.recipients)
  end

end
