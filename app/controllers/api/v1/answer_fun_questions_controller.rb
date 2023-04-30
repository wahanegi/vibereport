class Api::V1::AnswerFunQuestionsController < ApplicationController
  include ApplicationHelper
  before_action :retrieve_answer, only: %i[show update destroy]
  before_action :require_user!

  def show
    render json: AnswerFunQuestionSerializer.new(@answer).serializable_hash
  end

  def create
    answer = AnswerFunQuestion.new(answer_params)

    if answer.save
      update_question(answer)
      render json: AnswerFunQuestionSerializer.new(answer).serializable_hash
    else
      render json: { error: answer.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @answer.update(answer_params)
      render json: AnswerFunQuestionSerializer.new(@answer).serializable_hash
    else
      render json: { error: @answer.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    if @answer.destroy
      head :no_content, notice: 'Answer fun question was successfully destroyed.'
    else
      render json: { error: @answer.errors }, status: :unprocessable_entity
    end
  end

  private

  def retrieve_answer
    @answer = AnswerFunQuestion.find_by(id: params[:id], user_id: current_user.id)
  end

  def answer_params
    params.require(:answer_fun_question).permit(:answer_body, :response_id, :user_id, :fun_question_id)
  end

  def update_question(answer)
    question = answer.fun_question
    question.update(used: true, time_period_id: TimePeriod.current.id) if question.time_period_id.nil? || question.time_period_id != TimePeriod.current.id
  end
end
