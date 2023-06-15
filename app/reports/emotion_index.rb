class EmotionIndex < AdminReport
  include Chartkick::Helper

  def initialize(team, time_periods)
    super(team: team)
    @time_periods = time_periods
  end

  def generate
    return ['No emotion index present.', nil] if receive_responses.empty?

    positive_ratings_sum = positive_emotions(receive_responses)
    negative_ratings_sum = negative_emotions(receive_responses)

    result = (positive_ratings_sum - negative_ratings_sum) / receive_total_responses.to_f
    formatted_result = result.round(2)

    data = {
      'Positive Emotions' => positive_emotions_count(receive_responses),
      'Negative Emotions' => negative_emotions_count(receive_responses)
    }

    chart = generate_chart(data)

    [formatted_result, chart]
  end

  private

  def receive_responses
    if @team
      Response.joins(user: { teams: :user_teams })
              .where(user_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods }).distinct
    else
      Response.where(responses: { time_period_id: @time_periods }).distinct
    end
  end

  def receive_total_responses
    if @team
      @team.users.includes(:responses).where(responses: { time_period_id: @time_periods }).distinct.count
    else
      User.includes(:responses).where(responses: { time_period_id: @time_periods }).distinct.count
    end
  end

  def positive_emotions(responses)
    positive_emotion_ids = responses.joins(:emotion)
                                    .where(emotions: { category: 'positive' })
                                    .pluck(:id)
    Response.where(id: positive_emotion_ids, time_period_id: @time_periods).sum(:rating)
  end

  def negative_emotions(responses)
    negative_emotion_ids = responses.joins(:emotion)
                                    .where(emotions: { category: 'negative' })
                                    .pluck(:id)
    Response.where(id: negative_emotion_ids, time_period_id: @time_periods).sum(:rating)
  end

  def positive_emotions_count(responses)
    responses.joins(:emotion)
             .where(emotions: { category: 'positive' })
             .count
  end

  def negative_emotions_count(responses)
    responses.joins(:emotion)
             .where(emotions: { category: 'negative' })
             .count
  end

  def generate_chart(data)
    chart_id = SecureRandom.uuid

    pie_chart(
      data,
      id: chart_id,
      donut: true,
      colors: ['#00FF00', '#FF0000'],
      library: { legend: { position: 'bottom' } }
    )
  end
end
