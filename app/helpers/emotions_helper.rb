module EmotionsHelper
  def alert_questions_needed?
    unused_questions_count = FunQuestion.where(used: false).count
    unused_questions_count.zero?
  end
end
