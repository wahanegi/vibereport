class ParticipationPercentage < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    return 'No team provided' unless @team

    total_users = @team.users.count
    return 'No users present' unless total_users.positive?

    total_possible_responses, responding_users = calculate_values(total_users)

    calculate_percentage(responding_users, total_possible_responses)
  end

  private

  def calculate_values(total_users)
    total_possible_responses = total_users * @time_periods.size
    responding_users = responding_users_count
    [total_possible_responses, responding_users]
  end

  def responding_users_count
    Response.where(user: @team.users, time_period: @time_periods).count
  end

  def calculate_percentage(actual_responses, total_possible_responses)
    ((actual_responses.to_f / total_possible_responses) * 100).round(2)
  end
end
