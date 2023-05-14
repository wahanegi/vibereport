class Api::V1::ResultsPresenter
  include ApplicationHelper
  attr_reader :time_period_id, :fun_question, :time_period, :current_user

  def initialize(time_period_id, current_user)
    @time_period_id = time_period_id
    @time_period ||= TimePeriod.find(time_period_id)
    @fun_question ||= FunQuestion.find_by(time_period_id:)
    @current_user ||= current_user
  end

  def json_hash
    {
      time_periods: TimePeriod.ordered || [],
      emotions: time_period.emotions.shuffle.presence || [],
      gifs: time_period.responses.pluck(:gif).compact || [],
      fun_question: question,
      answers:,
      sent_shoutouts:,
      received_shoutouts:,
      current_user_shoutouts:
    }
  end

  private

  def question
    return nil if fun_question.blank?

    {
      question_body: fun_question.question_body,
      user: fun_question.user
    }
  end

  def answers
    return nil if fun_question&.fun_question_answers.blank?

    fun_question&.fun_question_answers&.map { |answer| answer_block(answer) }
  end

  def answer_block(answer)
    {
      answer:,
      user: answer.user
    }
  end

  def sent_shoutouts
    sent_shoutouts = User.ordered.filter_map do |user|
      if user.mentions.where(time_period_id: @time_period.id).any?
        {
          recipient: user,
          count: user.mentions.where(time_period_id: @time_period.id).size
        }
      end
    end
    sent_shoutouts.sort_by { |hash| -hash[:count] }.uniq
  end

  def received_shoutouts
    received_shoutouts = @time_period.shoutouts.filter_map do |shoutout|
      {
        sender: shoutout.user,
        count: @time_period.shoutouts.where(user_id: shoutout.user.id).size
      }
    end
    received_shoutouts.sort_by { |hash| -hash[:count] }.uniq
  end

  def current_user_shoutouts
    {
      received: current_user.mentions.where(time_period_id: @time_period.id).map { |shoutout| shoutout_block(shoutout) },
      sent: current_user.shoutouts.where(time_period_id: @time_period.id).map { |shoutout| recipients_block(shoutout) },
      total_count: @time_period.shoutouts.size
    }
  end

  def shoutout_block(shoutout)
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
