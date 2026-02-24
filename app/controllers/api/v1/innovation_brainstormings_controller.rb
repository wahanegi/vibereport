class Api::V1::InnovationBrainstormingsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_innovation_brainstorming, only: %i[show update destroy]

  def show
    render json: InnovationBrainstormingSerializer.new(@innovation_brainstorming).serializable_hash
  end

  def create
    innovation_brainstorming = current_user.innovation_brainstormings.build(innovation_brainstorming_params)

    if innovation_brainstorming.save
      render json: InnovationBrainstormingSerializer.new(innovation_brainstorming).serializable_hash, status: :created
    else
      render json: { error: innovation_brainstorming.errors }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotUnique
    render json: { error: { innovation_topic_id: ['can submit only one brainstorming per topic'] } },
           status: :unprocessable_entity
  end

  def update
    if @innovation_brainstorming.update(params.require(:innovation_brainstorming).permit(:brainstorming_body))
      render json: InnovationBrainstormingSerializer.new(@innovation_brainstorming).serializable_hash
    else
      render json: { error: @innovation_brainstorming.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @innovation_brainstorming.destroy!
    head :no_content
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: @innovation_brainstorming.errors }, status: :unprocessable_entity
  end

  private

  def set_innovation_brainstorming
    @innovation_brainstorming = current_user.innovation_brainstormings.find_by(id: params[:id])
    head :not_found if @innovation_brainstorming.blank?
  end

  def innovation_brainstorming_params
    params.require(:innovation_brainstorming).permit(:innovation_topic_id, :brainstorming_body)
  end
end
