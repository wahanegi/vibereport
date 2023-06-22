class ParticipationPercentage < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate(for_all_periods: false)
    return 'No team provided' unless @team

    total_users = @team.users.count
    return 'No users present' unless total_users.positive?

    total_possible_responses, responding_users = calculate_values(for_all_periods)

    calculate_percentage(responding_users, total_possible_responses)
  end

  private

  def calculate_values(for_all_periods)
    total_users = @team.users.count
    if for_all_periods
      all_periods_values(total_users)
    else
      specific_period_values(total_users)
    end
  end

  def all_periods_values(total_users)
    total_possible_responses = total_users * TimePeriod.count
    responding_users = responding_users_count(TimePeriod.pluck(:id))
    [total_possible_responses, responding_users]
  end

  def specific_period_values(total_users)
    total_possible_responses = total_users
    responding_users = responding_users_count(@time_periods)
    [total_possible_responses, responding_users]
  end

  def responding_users_count(time_period_ids)
    User.joins(:teams, :responses)
        .where(teams: { id: @team.id }, responses: { time_period_id: time_period_ids, not_working: false })
        .count
  end

  def calculate_percentage(actual_responses, total_possible_responses)
    ((actual_responses.to_f / total_possible_responses) * 100).round(2)
  end
end
