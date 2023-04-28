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
      gif_urls: gif_urls.presence || [],
      fun_question: fun_question.presence || {},
      answers: fun_question&.answer_fun_questions.presence || []
    }
  end

  private

  def gif_urls
    Response.working.where(time_period_id:).pluck(:gif_url).compact
  end
end
