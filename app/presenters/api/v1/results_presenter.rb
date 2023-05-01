class Api::V1::ResultsPresenter
  attr_reader :time_period_id, :fun_question, :time_period

  def initialize(time_period_id)
    @time_period_id = time_period_id
    @time_period = TimePeriod.find(time_period_id)
    @fun_question = FunQuestion.find_by(time_period_id:)
  end

  def json_hash
    {
      time_periods: TimePeriod.ordered || [],
      emotions: time_period.emotions.shuffle.presence || [],
      gifs: time_period.responses.pluck(:gif).compact || [],
      fun_question: question,
      answers:
    }
  end

  private

  def question
    return nil if fun_question.blank?

    {
      question_body: fun_question.question_body,
      user: fun_question.user
    }
  end

  def answers
    return nil if fun_question&.answer_fun_questions.blank?

    fun_question&.answer_fun_questions&.map { |answer| answer_block(answer) }
  end

  def answer_block(answer)
    {
      answer:,
      user: answer.user
    }
  end
end
