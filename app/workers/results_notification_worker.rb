class ResultsNotificationWorker
  attr_reader :users, :time_period

  def initialize
    @users = User.opt_in
    @time_period = TimePeriod.previous_time_period
    @fun_question_id = @time_period&.fun_question&.id
  end

  def run_notification
    return unless Date.current.strftime('%A').casecmp?(ENV.fetch('DAY_TO_SEND_RESULTS_EMAIL'))

    run_results_email!
  end

  private

  def run_results_email!
    return unless time_period_has_ended?

    user_recipients_ids = user_ids_from_recipients
    users.each do |user|
      send_results_email(user, time_period, @fun_question_id, user_recipients_ids) if user_has_response?(user)
    end
  end

  def send_results_email(user, time_period, fun_question_id, user_recipients_ids)
    word_counts = time_period.responses.completed.where.not(emotion_id: nil).includes(:emotion)
                             .where('emotions.category' => %w[positive negative])
                             .group('emotions.word', 'emotions.category')
                             .order('COUNT(emotions.word) DESC')
                             .pluck('emotions.word', 'emotions.category', 'COUNT(emotions.word) AS count_all')

    UserEmailMailer.results_email(
      user, time_period,
      counted_word(word_counts),
      fun_question_id, user_recipients_ids
    ).deliver_now
  end

  def time_period_has_ended?
    time_period.present? && time_period.end_date <= Date.current
  end

  def user_has_response?(user)
    user.responses.exists?(time_period_id: time_period.id)
  end

  def counted_word(word_counts)
    word_counts.first(36).map do |word, category, count|
      {
        word: word || 'No word found',
        category:,
        count:
      }
    end
  end

  def user_ids_from_recipients
    user_ids = []

    time_period.shoutouts.each do |shoutout|
      recipients = shoutout.shoutout_recipients
      recipients.each do |recipient|
        user_ids << recipient.user_id
      end
    end
    user_ids
  end
end
