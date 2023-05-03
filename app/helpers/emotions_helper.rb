module EmotionsHelper
  def alert_questions_needed?
    FunQuestion.not_used.empty?
  end
end
