module ActiveAdminHelpers
  def time_period_vars(team, time_period, previous_time_period, all_time_period, current_period)
    vars = {}

    vars[:emotion_index] = EmotionIndex.new(team, time_period).generate
    vars[:previous_emotion_index] = EmotionIndex.new(team, previous_time_period).generate if previous_time_period
    vars[:emotion_index_all] = EmotionIndex.new(team, all_time_period).generate
    vars[:emotion_index_current_period] = EmotionIndex.new(nil, current_period).generate

    vars[:productivity_avg] = ProductivityAverage.new(team, time_period).generate
    vars[:previous_productivity_avg] = ProductivityAverage.new(team, previous_time_period).generate if previous_time_period
    vars[:productivity_avg_all] = ProductivityAverage.new(team, all_time_period).generate
    vars[:productivity_average_current_period] = ProductivityAverage.new(nil, current_period).generate

    vars[:participation_percentage] = ParticipationPercentage.new(team, time_period).generate
    vars[:previous_participation_percentage] = ParticipationPercentage.new(team, previous_time_period).generate if previous_time_period
    vars[:participation_percentage_all] = ParticipationPercentage.new(team, all_time_period).generate

    vars[:productivity_verbatims] = ProductivityVerbatims.new(team, time_period).generate
    vars[:positive_verbatims] = ProductivityVerbatims.new(nil, all_time_period).generate[:positive]
    vars[:neutral_verbatims] = ProductivityVerbatims.new(nil, all_time_period).generate[:neutral]
    vars[:negative_verbatims] = ProductivityVerbatims.new(nil, all_time_period).generate[:negative]

    vars[:celebrate_comments_count] = CelebrationsCount.new(team, time_period).generate
    vars[:previous_celebrate_comments_count] = CelebrationsCount.new(team, previous_time_period).generate if previous_time_period
    vars[:celebrate_comments_count_all] = CelebrationsCount.new(team, all_time_period).generate
    vars[:celebrations_count_current_period] = CelebrationsCount.new(nil, current_period).generate

    vars[:celebrate_verbatims] = CelebrationVerbatims.new(team, time_period).generate

    vars[:teammate_engagement_count] = TeammateEngagementCount.new(team, time_period).generate
    vars[:previous_teammate_engagement_count] = TeammateEngagementCount.new(team, previous_time_period).generate if previous_time_period
    vars[:teammate_engagement_count_all] = TeammateEngagementCount.new(team, all_time_period).generate
    vars[:teammate_engagement_count_current_period] = TeammateEngagementCount.new(nil, current_period).generate

    vars[:verbatim_list] = TeammateEngagementVerbatims.new(team, time_period).generate

    vars[:responses_data_all] = ResponsesReport.new(team, all_time_period).generate

    vars
  end

  def trend_direction(value1, value2, compare_as_floats: true)
    trend = calculate_trend(value1, value2, compare_as_floats)
    trend_style = calculate_trend_style(trend)
    { trend: trend, style: trend_style }
  end

  def calculate_trend(value1, value2, compare_as_floats)
    comparison_result = compare_as_floats ? compare_as_floats(value1, value2) : compare_as_strings(value1, value2)
    comparison_result ? '&#x2191;' : '&#x2193;'
  end

  private

  def compare_as_floats(value1, value2)
    value1.to_f < value2.to_f
  end
  
  def compare_as_strings(value1, value2)
    value1.to_s < value2.to_s
  end

  def calculate_trend_style(trend)
    color = trend == '&#x2191;' ? 'green' : 'red'
    "color: #{color}; font-size: 20px; font-weight: bold;"
  end
end
