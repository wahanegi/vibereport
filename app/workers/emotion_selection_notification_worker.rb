class EmotionSelectionNotificationWorker
  attr_reader :users, :time_period

  def initialize
    @users = User.opt_in
    find_or_create_time_period
  end

  def run_notification(operation = nil)
    case operation
    when :send_results_email
      return unless Date.current.strftime('%A').casecmp?(ENV.fetch('DAY_TO_SEND_RESULTS_EMAIL'))
      run_results_email!
    else
      return unless Date.current.strftime('%A').casecmp?(ENV.fetch('DAY_TO_SEND_INVITES'))
      time_period.update(due_date: Date.current)
      run_notification!
    end
  end

  private

  def run_results_email!
    if time_period_has_ended?
      users.each { |user| send_results_email(user, time_period) }
    end
  end

  def run_notification!
    users.each { |user| UserEmailMailer.response_invite(user, time_period).deliver_now }
  end
  
  def send_results_email(user, time_period)
    users = User.joins(responses: :emotion)
                .where(responses: { created_at: time_period.start_date..time_period.end_date })
                .where(opt_out: false)
                .distinct
  
    word_counts = Response.joins(:emotion)
                          .where(time_period_id: time_period.id)
                          .group("emotions.word", "emotions.category")
                          .order("COUNT(emotions.word) DESC")
                          .pluck("emotions.word", "emotions.category", "COUNT(emotions.word) AS count_all")
  
    words = word_counts.first(36).map do |word, category, count|
      {
        word: word || "No word found",
        category: category,
        count: count
      }
    end
  
    UserEmailMailer.results_email(user, time_period, words).deliver_now
  end
  
  def find_or_create_time_period
    @time_period = TimePeriod.current || TimePeriod.create_time_period
  end

  def time_period_has_ended?
    time_period.present? && time_period.end_date <= Date.current
  end
end