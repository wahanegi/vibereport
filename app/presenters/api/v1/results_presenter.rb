class Api::V1::ResultsPresenter
  include ApplicationHelper
  include ActiveAdminHelpers
  attr_reader :fun_question, :time_period, :current_user, :responses, :fun_question_answers, :users, :teams

  def initialize(time_period_slug, current_user)
    @time_period = TimePeriod.find_by(slug: time_period_slug)
    @responses = time_period.responses.completed.working
    @fun_question_answers = responses.filter_map(&:fun_question_answer)
    @fun_question = time_period.fun_question
    @users = responses.filter_map(&:user)
    @current_user = current_user
    @teams = current_user.teams
  end

  def json_hash
    {
      time_periods: TimePeriod.ordered || [],
      emotions: responses.filter_map(&:emotion).sample(36).presence || [],
      gifs:,
      fun_question: question,
      answers:,
      sent_shoutouts:,
      received_shoutouts:,
      current_user_shoutouts:,
      responses_count: responses.count,
      current_response: current_user.responses.working.find_by(time_period_id: time_period.id),
      current_user:,
      received_and_public_shoutouts:,
      teams: teams_with_emotion_index
    }
  end

  def emotion_index_all(team)
    vars = ActiveAdminHelpers.time_period_vars(
      team:,
      time_period:
    )
    vars[:emotion_index_all][0]
  end

  def productivity_average_all(team)
    vars = ActiveAdminHelpers.time_period_vars(
      team:,
      time_period:
    )
    vars[:productivity_avg_all]
  end

  def emotion_index_current_period(team)
    current_period = TimePeriod.current
    vars = ActiveAdminHelpers.time_period_vars(
      team:,
      current_period:
    )
    vars[:emotion_index_current_period][0]
  end

  def productivity_average_current_period(team)
    current_period = TimePeriod.current 
    vars = ActiveAdminHelpers.time_period_vars(
      team:,
      current_period:
    )
    vars[:productivity_average_current_period]
  end

  def previous_emotion_index(team)
    previous_time_period = TimePeriod.joins(responses: { user: :teams })
                                     .where('end_date < ?', time_period.start_date)
                                     .where(teams: { id: team.id })
                                     .where(responses: { not_working: false })
                                     .order(end_date: :desc)
                                     .first
    vars = ActiveAdminHelpers.time_period_vars(
      team:,
      previous_time_period:
    )
    vars[:previous_emotion_index][0] if vars[:previous_emotion_index].present?
  end

  def previous_productivity_average(team)
    previous_time_period = TimePeriod.joins(responses: { user: :teams })
                                     .where('end_date < ?', time_period.start_date)
                                     .where(teams: { id: team.id })
                                     .where(responses: { not_working: false })
                                     .order(end_date: :desc)
                                     .first
    vars = ActiveAdminHelpers.time_period_vars(
      team:,
      previous_time_period:
    )
    vars[:previous_productivity_avg]
  end

  private

  def teams_with_emotion_index
    @teams.map do |team|
      {
        id: team.id,
        name: team.name,
        emotion_index_all: emotion_index_all(team),
        productivity_average_all: productivity_average_all(team),
        emotion_index_current_period: emotion_index_current_period(team),
        productivity_average_current_period: productivity_average_current_period(team),
        previous_emotion_index: previous_emotion_index(team),
        previous_productivity_average: previous_productivity_average(team)
      }
    end
  end

  def gifs
    responses.filter_map { |response| gif_block(response) }
  end

  def gif_block(response)
    return nil if response.gif.blank?

    {
      image: response.gif,
      emotion: response.emotion
    }
  end

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
      user: answer.user,
      emojis: emojis_data(answer.emojis)
    }
  end

  def emojis_data(data)
    grouped_data = data.ordered.group_by { |entry| entry[:emoji_code] }

    grouped_data.map do |emoji_code, entries_with_emoji|
      {
        emoji_code:,
        emoji_name: entries_with_emoji.first.emoji_name,
        users: entries_with_emoji.map(&:user),
        count: entries_with_emoji.size,
        current_user_emoji: entries_with_emoji.find { |entry| entry[:user_id] == current_user.id }
      }
    end
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
      received: received_shoutout_blocks,
      sent: sent_shoutout_blocks,
      total_count: time_period.shoutouts.size
    }
  end

  def received_shoutout_blocks
    return [] unless current_user_has_response?

    current_user.mentions.where(time_period_id: time_period.id).filter_map { |shoutout| shoutout_block(shoutout) }
  end

  def sent_shoutout_blocks
    return [] unless current_user_has_response?

    current_user.shoutouts.where(time_period_id: time_period.id).filter_map { |shoutout| recipients_block(shoutout) }
  end

  def public_shoutout_blocks
    @public_shoutout_blocks ||=
      begin
        return_blocks = Shoutout.where(time_period_id: time_period.id, public: true) - current_user.shoutouts
        return_blocks.map { |shoutout| shoutout_block(shoutout) }
      end
  end

  def received_and_public_shoutouts
    combined = received_shoutout_blocks + public_shoutout_blocks
    return [] if combined.empty?

    combined.uniq
  end

  def current_user_has_response?
    users.include?(current_user)
  end

  def shoutout_block(shoutout)
    return nil unless users.include?(shoutout.user)

    {
      shoutout:,
      users: [shoutout.user],
      emojis: emojis_data(shoutout.emojis)
    }
  end

  def recipients_block(shoutout)
    {
      shoutout:,
      users: shoutout.shoutout_recipients.map(&:user),
      emojis: emojis_data(shoutout.emojis)
    }
  end
end
