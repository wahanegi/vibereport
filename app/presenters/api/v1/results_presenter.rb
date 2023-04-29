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
      emotions: time_period.emotions.presence || [],
      gifs: time_period.responses.pluck(:gif).compact || [],
      fun_question: fun_question.presence || {},
      answers: fun_question&.answer_fun_questions.presence || []
    }
  end
end
