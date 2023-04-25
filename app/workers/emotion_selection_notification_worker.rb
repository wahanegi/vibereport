class EmotionSelectionNotificationWorker
  attr_reader :users, :time_period

  def initialize
    @users = User.opt_in
    find_or_create_time_period
  end

  def run_notification
    return unless Date.current.strftime('%A').casecmp?(ENV.fetch('DAY_TO_SEND_INVITES'))

    time_period.update(due_date: Date.current)
    run_notification!
  end

  private

  def run_notification!
    if time_period_has_ended?
      users.each { |user| send_results_email(user, time_period) }
      create_new_time_period_and_send_invites
    elsif time_period.present?
      send_response_invites
    end
  end
  
  def send_results_email(user, time_period)
    users = User.joins(responses: :emotion)
                .where(responses: { created_at: time_period.start_date..time_period.end_date })
                .where(opt_out: false)
                .distinct
  
    words = Response.joins(:emotion)
                    .where(time_period_id: time_period.id)
                    .pluck("emotions.word", "emotions.category")
                    .uniq
  
    words = words.first(36).map do |word|
      {
        word: word[0] || "No word found",
        category: word[1]
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

  def send_response_invites
    users.each { |user| UserEmailMailer.response_invite(user, time_period).deliver_now }
  end

  def create_new_time_period_and_send_invites
    if time_period_has_ended?
      new_time_period = TimePeriod.create_time_period
      new_time_period.update(due_date: Date.current)
      users.each { |user| UserEmailMailer.response_invite(user, new_time_period).deliver_now }
    end
  end
end