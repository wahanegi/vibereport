class Api::V1::FunQuestionAnswersController < ApplicationController
  before_action :retrieve_answer, only: %i[show update destroy]
  before_action :authenticate_user!

  def show
    render json: FunQuestionAnswerSerializer.new(@answer).serializable_hash
  end

  def create
    answer = FunQuestionAnswer.new(answer_params)

    if answer.save
      update_question(answer)
      render json: FunQuestionAnswerSerializer.new(answer).serializable_hash
    else
      render json: { error: answer.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @answer.update(answer_params)
      render json: FunQuestionAnswerSerializer.new(@answer).serializable_hash
    else
      render json: { error: @answer.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    if @answer.destroy
      render json: { message: 'success' }, status: :ok
    else
      render json: { error: @answer.errors }, status: :unprocessable_entity
    end
  end

  private

  def retrieve_answer
    @answer = current_user.fun_question_answers.find_by(id: params[:id])
  end

  def answer_params
    params.require(:fun_question_answer).permit(:answer_body, :response_id, :user_id, :fun_question_id)
  end

  def update_question(answer)
    question = answer.fun_question
    return unless question.time_period_id.nil? || question.time_period_id != TimePeriod.current.id

    question.update(used: true,
                    time_period_id: TimePeriod.current.id)
  end
end
