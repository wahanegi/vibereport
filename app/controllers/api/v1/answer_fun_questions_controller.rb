class Api::V1::AnswerFunQuestionsController < ApplicationController

  def create
    answer = AnswerFunQuestion.new(answer_params)

    if answer.save
      update_question
      render json: AnswerFunQuestionSerializer.new(answer).serializable_hash
    else
      render json: { error: answer.errors }, status: :unprocessable_entity
    end
  end

  private

  def answer_params
    params.require(:answer_fun_question).permit(:answer_body, :response_id, :user_id, :fun_question_id)
  end

  def update_question
    question = FunQuestion.find_by(id: params[:fun_question_id])
    question.update(used: true, time_period_id: TimePeriod.current.id)
  end
end
