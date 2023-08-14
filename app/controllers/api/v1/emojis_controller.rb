class Api::V1::EmojisController < ApplicationController
  include ApplicationHelper
  before_action :require_user!, only: %i[create destroy]

  def create
    emoji = current_user.emojis.new(emoji_params)

    if emoji.save!
      render json: { data: emoji_object(emoji) }, status: :ok
    else
      render json: { error: emoji.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    if emoji.destroy
      render json: { message: 'success' }, status: :ok
    else
      render json: { error: emoji.errors }, status: :unprocessable_entity
    end
  end

  private

  def emoji_object(emoji)
    {
      emoji_data: emoji,
      user: current_user
    }
  end

  def emoji_params
    params.require(:emoji_object).permit(:id, :emoji, :emojiable_type, :emojiable_id)
  end

  def emoji
    @emoji ||= Emoji.find_by(id: params[:id])
  end
end
