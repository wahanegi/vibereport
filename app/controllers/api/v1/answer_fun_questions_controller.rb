class Api::V1::AnswerFunQuestionsController < ApplicationController

  def create
    answer = AnswerFunQuestion.new(answer_params)

    if answer.save
      render json: AnswerFunQuestionSerializer.new(answer).serializable_hash
    else
      render json: { error: answer.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @answer.update(answer_params)
      render json: AnswerFunQuestionSerializer.new(@answer).serializable_hash.merge(add_chosen_answer)
    else
      render json: { error: @response.errors }, status: :unprocessable_entity
    end
  end

  private

  def retrieve_answer
    @answer = AnswerFunQuestion.find_by(id: params[:id])
  end

  def add_chosen_answer
    { answer_fun_question: @answer.answer_body }
  end

  def answer_params
    params.require(:answer_fun_question).permit(:answer_body, :response_id, :user_id, :fun_question_id)
  end
end
