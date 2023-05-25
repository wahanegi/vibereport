include Chartkick::Helper
class EmotionIndex < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    responses = Response.joins(user: { teams: :users_teams })
                        .where(users_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods }).distinct

    return { emotion_index: "No emotion index available.", chart: nil } if responses.empty?

    positive_emotion_ids = responses.joins(:emotion)
                                     .where(emotions: { category: 'positive' })
                                     .distinct
                                     .pluck(:emotion_id)
    negative_emotion_ids = responses.joins(:emotion)
                                     .where(emotions: { category: 'negative' })
                                     .distinct
                                     .pluck(:emotion_id)

    positive_ratings_sum = responses.where(emotion_id: positive_emotion_ids).distinct.sum(:rating)
    negative_ratings_sum = responses.where(emotion_id: negative_emotion_ids).distinct.sum(:rating)

    total_responses = @team.users.includes(:responses).where(responses: { time_period_id: @time_periods }).distinct.count

    result = (positive_ratings_sum - negative_ratings_sum) / total_responses.to_f
    formatted_result = result.round(2)
    data = {
      'Positive Emotions' => positive_emotion_ids.count,
      'Negative Emotions' => negative_emotion_ids.count
    }

    chart_id = SecureRandom.uuid

    chart = pie_chart data, id: chart_id, donut: true, colors: ["#00FF00", "#FF0000"], library: { legend: { position: 'bottom' } }
    { emotion_index: formatted_result, chart: chart }  
  end
end
