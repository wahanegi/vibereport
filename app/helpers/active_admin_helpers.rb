module ActiveAdminHelpers
  URL = { controller: 'api/v1/responses', action: 'response_flow_from_email' }.freeze
  VISIBLE_BUBBLES = 3

  def self.time_period_vars(
    team: nil,
    time_period: [],
    previous_time_period: [],
    current_period: nil,
    only: []
  )
    all_time_periods = team ? TimePeriod.with_responses_by_team(team).distinct : TimePeriod.all
    time_period = [time_period] if time_period.is_a?(TimePeriod)
    vars = {}

    vars[:emotion_index] = EmotionIndex.new(team, time_period).generate if only.include?(:emotion_index)
    vars[:emotion_index_all] = EmotionIndex.new(team, all_time_periods).generate if only.include?(:emotion_index_all)
    vars[:emotion_index_current_period] = EmotionIndex.new(team, current_period).generate if only.include?(:emotion_index_current_period)

    vars[:productivity_avg] = ProductivityAverage.new(team, time_period).generate if only.include?(:productivity_avg)
    vars[:productivity_avg_all] = ProductivityAverage.new(team, all_time_periods).generate if only.include?(:productivity_avg_all)
    vars[:productivity_average_current_period] = ProductivityAverage.new(team, current_period).generate if only.include?(:productivity_average_current_period)

    vars[:participation_percentage] = ParticipationPercentage.new(team, time_period).generate if only.include?(:participation_percentage)
    vars[:participation_percentage_all] = ParticipationPercentage.new(team, all_time_periods).generate if only.include?(:participation_percentage_all)

    vars[:productivity_verbatims] = ProductivityVerbatims.new(team, team.nil? ? current_period : time_period).generate if only.include?(:productivity_verbatims)

    vars[:celebrate_comments_count] = CelebrationsCount.new(team, time_period).generate if only.include?(:celebrate_comments_count)
    vars[:celebrate_comments_count_all] = CelebrationsCount.new(team, all_time_periods).generate if only.include?(:celebrate_comments_count_all)
    vars[:celebrations_count_current_period] = CelebrationsCount.new(team, current_period).generate if only.include?(:celebrations_count_current_period)

    vars[:celebrate_verbatims] = CelebrationVerbatims.new(team, time_period).generate if only.include?(:celebrate_verbatims)

    vars[:teammate_engagement_count] = TeammateEngagementCount.new(team, time_period).generate if only.include?(:teammate_engagement_count)
    vars[:teammate_engagement_count_all] = TeammateEngagementCount.new(team, all_time_periods).generate if only.include?(:teammate_engagement_count_all)
    vars[:teammate_engagement_count_current_period] = TeammateEngagementCount.new(team, current_period).generate if only.include?(:teammate_engagement_count_current_period)

    vars[:verbatim_list] = TeammateEngagementVerbatims.new(team, time_period).generate if only.include?(:verbatim_list)

    vars[:responses_data_all] = ResponsesReport.new(team, all_time_periods).generate if only.include?(:responses_data_all)

    vars[:shoutout_user_names] = ShoutoutAuthorReport.new(team, time_period).generate if only.include?(:shoutout_user_names)

    if previous_time_period
      vars[:previous_shoutouts_count] = ShoutoutsCountReport.new(team, previous_time_period).generate if only.include?(:previous_shoutouts_count)
      vars[:previous_emotion_index] = EmotionIndex.new(team, previous_time_period).generate if only.include?(:previous_emotion_index)
      vars[:previous_productivity_avg] = ProductivityAverage.new(team, previous_time_period).generate if only.include?(:previous_productivity_avg)
      vars[:previous_participation_percentage] = ParticipationPercentage.new(team, previous_time_period).generate if only.include?(:previous_participation_percentage)
      vars[:previous_celebrate_comments_count] = CelebrationsCount.new(team, previous_time_period).generate if only.include?(:previous_celebrate_comments_count)
      vars[:previous_teammate_engagement_count] = TeammateEngagementCount.new(team, previous_time_period).generate if only.include?(:previous_teammate_engagement_count)
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