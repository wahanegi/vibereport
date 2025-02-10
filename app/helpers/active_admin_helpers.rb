module ActiveAdminHelpers
  URL = { controller: 'api/v1/responses', action: 'response_flow_from_email' }.freeze

  def self.time_period_vars(
    team: nil,
    time_period: [],
    previous_time_period: [],
    current_period: nil
  )
    all_time_periods = TimePeriod.distinct
                                 .joins(responses: { user: :teams })
                                 .where(responses: { user: { teams: team } })
    vars = {}

    vars[:emotion_index] = EmotionIndex.new(team, time_period).generate
    vars[:emotion_index_all] = EmotionIndex.new(team, all_time_periods).generate
    vars[:emotion_index_current_period] = EmotionIndex.new(team, current_period).generate

    vars[:productivity_avg] = ProductivityAverage.new(team, time_period).generate
    vars[:productivity_avg_all] = ProductivityAverage.new(team, all_time_periods).generate
    vars[:productivity_average_current_period] = ProductivityAverage.new(team, current_period).generate

    vars[:participation_percentage] = ParticipationPercentage.new(team, time_period).generate
    vars[:participation_percentage_all] = ParticipationPercentage.new(team, all_time_periods).generate(for_all_periods: true)

    vars[:productivity_verbatims] = ProductivityVerbatims.new(team, team.nil? ? current_period : time_period).generate

    vars[:celebrate_comments_count] = CelebrationsCount.new(team, time_period).generate
    vars[:celebrate_comments_count_all] = CelebrationsCount.new(team, all_time_periods).generate
    vars[:celebrations_count_current_period] = CelebrationsCount.new(team, current_period).generate

    vars[:celebrate_verbatims] = CelebrationVerbatims.new(team, time_period).generate

    vars[:teammate_engagement_count] = TeammateEngagementCount.new(team, time_period).generate
    vars[:teammate_engagement_count_all] = TeammateEngagementCount.new(team, all_time_periods).generate
    vars[:teammate_engagement_count_current_period] = TeammateEngagementCount.new(team, current_period).generate

    vars[:verbatim_list] = TeammateEngagementVerbatims.new(team, time_period).generate

    vars[:responses_data_all] = ResponsesReport.new(team, all_time_periods).generate

    if previous_time_period
      vars[:previous_emotion_index] = EmotionIndex.new(team, previous_time_period).generate
      vars[:previous_productivity_avg] = ProductivityAverage.new(team, previous_time_period).generate
      vars[:previous_participation_percentage] = ParticipationPercentage.new(team, previous_time_period).generate
      vars[:previous_celebrate_comments_count] = CelebrationsCount.new(team, previous_time_period).generate
      vars[:previous_teammate_engagement_count] = TeammateEngagementCount.new(team, previous_time_period).generate
    end

    vars
  end

  def trend_direction(value1, value2)
    value1 = value1[0] if value1.is_a?(Array)
    value2 = value2[0] if value2.is_a?(Array)

    trend = calculate_trend(value1.to_f, value2.to_f)
    trend_style = calculate_trend_style(trend)
    [trend, trend_style]
  end

  def calculate_trend(value1, value2)
    if value1 == value2
      ''
    else
      trend_arrow(float_lesser_than?(value1, value2))
    end
  end

  def trend_arrow(lesser)
    lesser ? '&#x2191;' : '&#x2193;'
  end

  private

  def float_lesser_than?(value1, value2)
    value1 = value1[0] if value1.is_a?(Array)
    value2 = value2[0] if value2.is_a?(Array)
    value1.to_f < value2.to_f
  end

  def calculate_trend_style(trend)
    color = case trend
            when '&#x2191;'
              'green'
            when ''
              'goldenrod'
            else
              'red'
            end
    "color: #{color}; font-size: 20px; font-weight: bold;"
  end
end
