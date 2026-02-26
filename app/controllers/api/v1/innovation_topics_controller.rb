class Api::V1::InnovationTopicsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_innovation_topic, only: %i[show update destroy]

  def show
    render json: InnovationTopicSerializer.new(@innovation_topic).serializable_hash
  end

  def create
    innovation_topic = current_user.innovation_topics.build(innovation_topic_params)

    if innovation_topic.save
      render json: InnovationTopicSerializer.new(innovation_topic).serializable_hash, status: :created
    else
      render json: { error: innovation_topic.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @innovation_topic.update(innovation_topic_params)
      render json: InnovationTopicSerializer.new(@innovation_topic).serializable_hash
    else
      render json: { error: @innovation_topic.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @innovation_topic.destroy!
    head :no_content
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: @innovation_topic.errors }, status: :unprocessable_entity
  end

  private

  def set_innovation_topic
    @innovation_topic = InnovationTopic.find_by(id: params[:id])
    head :not_found if @innovation_topic.blank?
  end

  def innovation_topic_params
    params.require(:innovation_topic).permit(:innovation_body, :time_period_id)
  end
end
