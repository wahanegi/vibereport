class Api::V1::FunQuestionsController < ApplicationController
  include ApplicationHelper
  before_action :require_user!

  def show
    render json: FunQuestionSerializer.new(fun_question).serializable_hash
  end

  def create
    fun_question = FunQuestion.new(fun_question_params)

    if fun_question.save
      render json: FunQuestionSerializer.new(fun_question).serializable_hash
    else
      render json: { error: fun_question.errors }, status: :unprocessable_entity
    end
  end

  def update
    if fun_question.update(fun_question_params)
      render json: FunQuestionSerializer.new(fun_question).serializable_hash
    else
      render json: { error: fun_question.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    if fun_question.destroy
      head :no_content, notice: 'Fun question was successfully destroyed.'
    else
      render json: { error: fun_question.errors }, status: :unprocessable_entity
    end
  end

  private

  def fun_question
    @fun_question ||= FunQuestion.find_by(id: params[:id])
  end

  def fun_question_params
    params.require(:fun_question).permit(:user_id, :time_period_id, :question_body)
  end
end
