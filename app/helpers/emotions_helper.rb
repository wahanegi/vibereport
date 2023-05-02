module EmotionsHelper
  def alert_questions_needed?
    unused_questions_count = FunQuestion.not_used.count
    unused_questions_count.zero?
  end
end
