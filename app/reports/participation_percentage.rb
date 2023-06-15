class ParticipationPercentage < AdminReport
  def initialize(team, time_periods)
    super(team: team)
    @time_periods = time_periods
  end

  def generate
    return 'No team provided' unless @team

    total_users = @team.users.count

    return 'No users present' unless total_users.positive?

    responding_users = count_responding_users
    calculate_percentage(responding_users, total_users)
  end

  private

  def count_responding_users
    User.joins(:teams, :responses)
        .where(teams: { id: @team.id }, responses: { time_period_id: @time_periods })
        .distinct
        .count
  end

  def calculate_percentage(responding_users, total_users)
    ((responding_users.to_f / total_users) * 100).round(2)
  end
end
