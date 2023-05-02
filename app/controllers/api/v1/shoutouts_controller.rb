class Api::V1::ShoutoutsController < ApplicationController
  def create
    @shoutout = Shoutout.new(shoutout_params)

    if @shoutout.save
      redirect_to @shoutout,  status: :ok
    else
      render json: { error: @shoutout[:errors] }, status: :unprocessable_entity
    end
  end

  def update
    @shoutout = Shoutout.find(params[:id])

    if @shoutout.update(shoutout_params)
      redirect_to @shoutout, notice: 'Model was successfully updated.'
    else
      render json: { error: @shoutout[:errors] }, status: :unprocessable_entity
    end
  end

  private

  def shoutout_params
    params.require(:shoutout).permit(:user_id, :time_period, rich_text, [recipients: []])
  end
end
