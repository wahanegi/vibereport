class ParticipationPercentage < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate(for_all_periods: false)
    return 'No team provided' unless @team

    total_users = @team.users.count
    return 'No users present' unless total_users.positive?

    if for_all_periods
      total_possible_responses = total_users * TimePeriod.count
      responding_users = User.joins(:teams, :responses)
                             .where(teams: { id: @team.id }, responses: { time_period_id: TimePeriod.pluck(:id) })
                             .distinct
                             .count
    else
      total_possible_responses = total_users
      responding_users = User.joins(:teams, :responses)
                             .where(teams: { id: @team.id }, responses: { time_period_id: @time_periods })
                             .distinct
                             .count
    end

    calculate_percentage(responding_users, total_possible_responses)
  end

  private

  def count_actual_responses
    User.joins(:teams, :responses)
        .where(teams: { id: @team.id }, responses: {time_period_id: TimePeriod.pluck(:id), not_working: false })
        .distinct
        .count('responses.id')
  end

  def calculate_percentage(actual_responses, total_possible_responses)
    ((actual_responses.to_f / total_possible_responses) * 100).round(2)
  end
end
