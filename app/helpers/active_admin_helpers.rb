module ActiveAdminHelpers
  def self.all_time_periods
    TimePeriod.all
  end

  def self.time_period_vars(team: nil, time_period: nil, previous_time_period: nil, current_period: nil)
    all_time_periods = ActiveAdminHelpers.all_time_periods
    vars = {}

    vars[:emotion_index] = EmotionIndex.new(team, time_period).generate
    vars[:emotion_index_all] = EmotionIndex.new(team, all_time_periods).generate
    vars[:emotion_index_current_period] = EmotionIndex.new(nil, current_period).generate

    vars[:productivity_avg] = ProductivityAverage.new(team, time_period).generate
    vars[:productivity_avg_all] = ProductivityAverage.new(team, all_time_periods).generate
    vars[:productivity_average_current_period] = ProductivityAverage.new(nil, current_period).generate

    vars[:participation_percentage] = ParticipationPercentage.new(team, time_period).generate
    vars[:participation_percentage_all] = ParticipationPercentage.new(team, all_time_periods).generate

    vars[:productivity_verbatims] = ProductivityVerbatims.new(team, time_period).generate
    vars[:positive_verbatims] = ProductivityVerbatims.new(nil, all_time_periods).generate[:positive]
    vars[:neutral_verbatims] = ProductivityVerbatims.new(nil, all_time_periods).generate[:neutral]
    vars[:negative_verbatims] = ProductivityVerbatims.new(nil, all_time_periods).generate[:negative]

    vars[:celebrate_comments_count] = CelebrationsCount.new(team, time_period).generate
    vars[:celebrate_comments_count_all] = CelebrationsCount.new(team, all_time_periods).generate
    vars[:celebrations_count_current_period] = CelebrationsCount.new(nil, current_period).generate

    vars[:celebrate_verbatims] = CelebrationVerbatims.new(team, time_period).generate

    vars[:teammate_engagement_count] = TeammateEngagementCount.new(team, time_period).generate
    vars[:teammate_engagement_count_all] = TeammateEngagementCount.new(team, all_time_periods).generate
    vars[:teammate_engagement_count_current_period] = TeammateEngagementCount.new(nil, current_period).generate

    vars[:verbatim_list] = TeammateEngagementVerbatims.new(team, time_period).generate

    vars[:responses_data_all] = ResponsesReport.new(team, all_time_periods).generate

    if previous_time_period
      vars[:previous_emotion_index] = EmotionIndex.new(team, previous_time_period).generate
      vars[:previous_productivity_avg] = ProductivityAverage.new(team, previous_time_period).generate
      vars[:previous_participation_percentage] = ParticipationPercentage.new(team, previous_time_period).generate
      vars[:previous_celebrate_comments_count] = CelebrationsCount.new(team, previous_time_period).generate
      vars[:previous_teammate_engagement_count] = TeammateEngagementCount.new(team, previous_time_period).generate
    end

    vars[:all_time_periods] = all_time_periods

    vars
  end

  def trend_direction(value1, value2, compare_as_floats: true)
    trend = calculate_trend(value1, value2, compare_as_floats)
    trend_style = calculate_trend_style(trend)
    [trend, trend_style]
  end

  def calculate_trend(value1, value2, compare_as_float)
    if value1 == value2
      '&#x2195;'
    else
      trend_arrow(compare_as_float ? float_lesser_than?(value1, value2) : lesser_than?(value1, value2))
    end
  end

  def trend_arrow(lesser)
    lesser ? '&#x2191;' : '&#x2193;'
  end

  private

  def float_lesser_than?(value1, value2)
    value1.to_f < value2.to_f
  end

  def lesser_than?(value1, value2)
    value1 << value2
  end

  def calculate_trend_style(trend)
    color = trend == '&#x2191;' ? 'green' : (trend == '&#x2195;' ? 'goldenrod' : 'red')
    "color: #{color}; font-size: 20px; font-weight: bold;"
  end
end
