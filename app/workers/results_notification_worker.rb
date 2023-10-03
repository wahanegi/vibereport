class ResultsNotificationWorker
  attr_reader :users, :time_period

  def initialize
    @users = User.opt_in
    @time_period = TimePeriod.previous_time_period
  end

  def run_notification
    return unless Date.current.strftime('%A').casecmp?(ENV.fetch('DAY_TO_SEND_RESULTS_EMAIL'))

    run_results_email!
  end

  private

  def run_results_email!
    return unless time_period_has_ended?

    users.each do |user|
      send_results_email(user, time_period) if user_has_response?(user)
    end
  end

  def send_results_email(user, time_period)
    UserEmailMailer.results_email(user, time_period).deliver_now
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
end
