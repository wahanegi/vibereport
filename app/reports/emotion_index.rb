class EmotionIndex < AdminReport
  include Chartkick::Helper
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    responses = receive_responses

    return { emotion_index: 'No emotion index present.', chart: nil } if responses.empty?

    positive_emotion_ids = positive_emotions(responses)
    negative_emotion_ids = negative_emotions(responses)

    positive_ratings_sum = responses.where(emotion_id: positive_emotion_ids).distinct.sum(:rating)
    negative_ratings_sum = responses.where(emotion_id: negative_emotion_ids).distinct.sum(:rating)

    total_responses = receive_total_responses

    result = (positive_ratings_sum - negative_ratings_sum) / total_responses.to_f
    formatted_result = result.round(2)
    data = {
      'Positive Emotions' => positive_emotion_ids.count,
      'Negative Emotions' => negative_emotion_ids.count
    }

    chart_id = SecureRandom.uuid

    chart = pie_chart data, id: chart_id, donut: true, colors: ['#00FF00', '#FF0000'], library: { legend: { position: 'bottom' } }
    { emotion_index: formatted_result, chart: chart }
  end

  private

  def receive_responses
    if @team
      Response.joins(user: { teams: :users_teams })
              .where(users_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods }).distinct
    else
      Response.where(responses: { time_period_id: @time_periods }).distinct
    end
  end

  def receive_total_responses
    if @team
      @team.users.includes(:responses).where(responses: { time_period_id: @time_periods }).distinct.count
    else
      User.joins(:responses).where(responses: { time_period_id: @time_periods }).distinct.count
    end
  end

  def positive_emotions(responses)
    responses.joins(:emotion)
             .where(emotions: { category: 'positive' })
             .distinct
             .pluck(:emotion_id)
  end

  def negative_emotions(responses)
    responses.joins(:emotion)
             .where(emotions: { category: 'negative' })
             .distinct
             .pluck(:emotion_id)
  end
end
