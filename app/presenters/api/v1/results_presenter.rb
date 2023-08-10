class Api::V1::ResultsPresenter
  include ApplicationHelper
  attr_reader :fun_question, :time_period, :current_user, :responses, :fun_question_answers, :users

  def initialize(time_period_slug, current_user)
    @time_period = TimePeriod.find_by(slug: time_period_slug)
    @responses = time_period.responses.completed.working
    @fun_question_answers = responses.filter_map(&:fun_question_answer)
    @fun_question = time_period.fun_question
    @users = responses.filter_map(&:user)
    @current_user = current_user
  end

  def json_hash
    {
      time_periods: TimePeriod.ordered || [],
      emotions: responses.filter_map(&:emotion).sample(36).presence || [],
      gifs: responses.pluck(:gif).compact.reject(&:empty?) || [],
      fun_question: question,
      answers:,
      sent_shoutouts:,
      received_shoutouts:,
      current_user_shoutouts:,
      responses_count: responses.count,
      current_response: current_user.responses.working.find_by(time_period_id: time_period.id),
      current_user:
    }
  end

  private

  def question
    return nil if fun_question.blank?

    {
      id: fun_question.id,
      question_body: fun_question.question_body,
      user: fun_question.user
    }
  end

  def answers
    return nil if fun_question_answers.blank?

    sort_answers_with_current_user_first(fun_question_answers, current_user).map { |answer| answer_block(answer) }
  end

  def sort_answers_with_current_user_first(answers, current_user)
    current_user_answer, other_answers = answers.partition { |answer| answer.user == current_user }
    sorted_other_answers = other_answers.sort_by(&:created_at)
    [current_user_answer, sorted_other_answers].flatten.compact
  end

  def answer_block(answer)
    {
      answer:,
      user: answer.user
    }
  end

  def sent_shoutouts
    sent_shoutouts = users.filter_map do |user|
      if user.mentions.where(time_period_id: time_period.id).any?
        {
          recipient: user,
          count: user.mentions.where(time_period_id: time_period.id).size
        }
      end
    end
    sent_shoutouts.sort_by { |hash| -hash[:count] }.uniq
  end

  def received_shoutouts
    received_shoutouts = users.filter_map do |user|
      if user.shoutouts.where(time_period_id: time_period.id).any?
        {
          sender: user,
          count: user.shoutouts.where(time_period_id: time_period.id).size
        }
      end
    end
    received_shoutouts.sort_by { |hash| -hash[:count] }.uniq
  end

  def current_user_shoutouts
    {
      received:,
      sent:,
      total_count: time_period.shoutouts.size
    }
  end

  def received
    return [] unless current_user_has_response?

    current_user.mentions.where(time_period_id: time_period.id).filter_map { |shoutout| shoutout_block(shoutout) }
  end

  def sent
    return [] unless current_user_has_response?

    current_user.shoutouts.where(time_period_id: time_period.id).filter_map { |shoutout| recipients_block(shoutout) }
  end

  def current_user_has_response?
    users.include?(current_user)
  end

  def shoutout_block(shoutout)
    return nil unless users.include?(shoutout.user)

    {
      shoutout:,
      users: [shoutout.user]
    }
  end

  def recipients_block(shoutout)
    {
      shoutout:,
      users: shoutout.shoutout_recipients.map(&:user)
    }
  end
end
