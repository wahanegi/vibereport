class EmotionIndex < AdminReport
  include Chartkick::Helper

  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    return { emotion_index: 'No emotion index available.', chart: nil } if responses.empty?

    result = calculate_emotion_index
    formatted_result = result.round(2)
    chart = generate_chart

    { emotion_index: formatted_result, chart: chart }
  end

  private

  def responses
    @responses ||=
      if @team
        Response.joins(user: { teams: :users_teams })
                .where(users_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods }).distinct
      else
        Response.where(responses: { time_period_id: @time_periods }).distinct
      end
  end

  def total_responses
    @total_responses ||=
      if @team
        @team.users.includes(:responses).where(responses: { time_period_id: @time_periods }).distinct.count
      else
        User.joins(:responses).where(responses: { time_period_id: @time_periods }).distinct.count
      end
  end

  def calculate_emotion_index
    positive_ratings_sum = responses.where(emotion_id: positive_emotion_ids).distinct.sum(:rating)
    negative_ratings_sum = responses.where(emotion_id: negative_emotion_ids).distinct.sum(:rating)

    (positive_ratings_sum - negative_ratings_sum) / total_responses.to_f
  end

  def positive_emotion_ids
    @positive_emotion_ids ||= responses.joins(:emotion)
                                       .where(emotions: { category: 'positive' })
                                       .distinct
                                       .pluck(:emotion_id)
  end

  def negative_emotion_ids
    @negative_emotion_ids ||= responses.joins(:emotion)
                                       .where(emotions: { category: 'negative' })
                                       .distinct
                                       .pluck(:emotion_id)
  end

  def generate_chart
    data = {
      'Positive Emotions' => positive_emotion_ids.count,
      'Negative Emotions' => negative_emotion_ids.count
    }
    chart_id = SecureRandom.uuid
    pie_chart data, id: chart_id, donut: true, colors: ['#00FF00', '#FF0000'], library: { legend: { position: 'bottom' } }
  end
end
