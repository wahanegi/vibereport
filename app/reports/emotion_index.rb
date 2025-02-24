class EmotionIndex < AdminReport
  include Chartkick::Helper

  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    responses = receive_responses

    return ['No emotion index present.', nil] if responses.empty?

    positive_ratings_sum = emotion_ratings_sum(responses, 'positive')
    negative_ratings_sum = emotion_ratings_sum(responses, 'negative')

    formatted_result = calculate_emotion_index(positive_ratings_sum, negative_ratings_sum)

    chart = generate_chart(responses)

    [formatted_result, chart]
  end

  private

  def team_responses(team)
    Response.joins(user: { teams: :user_teams })
            .where(user_teams: { team_id: team.id })
            .where(responses: { time_period_id: @time_periods, not_working: false })
            .where.not(emotion_id: nil)
  end

  def non_team_responses
    Response.where(time_period_id: @time_periods, not_working: false)
            .where.not(emotion_id: nil)
  end

  def receive_responses
    @team ? team_responses(@team).distinct : non_team_responses
  end

  def receive_total_responses
    @team ? team_responses(@team).distinct.count : non_team_responses.count
  end

  def emotion_ratings_sum(responses, category)
    positive_emotion_ids = responses.joins(:emotion)
                                    .where(emotions: { category: category })
                                    .pluck(:id)
    Response.where(id: positive_emotion_ids, time_period_id: @time_periods).sum(:rating)
  end

  def emotions_count(responses, category)
    responses.joins(:emotion)
             .where(emotions: { category: category })
             .count
  end

  def generate_chart(responses)
    data = {
      'Positive Emotions' => emotions_count(responses, 'positive'),
      'Negative Emotions' => emotions_count(responses, 'negative')
    }
    chart_id = SecureRandom.uuid

    pie_chart(data,
              id: chart_id,
              donut: true,
              colors: ['#00FF00', '#FF0000'],
              library: { legend: { position: 'bottom' } })
  end

  def calculate_emotion_index(positive_ratings_sum, negative_ratings_sum)
    ((positive_ratings_sum - negative_ratings_sum) / receive_total_responses.to_f).round(2)
  end
end
