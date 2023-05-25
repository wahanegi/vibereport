class ResponsePercentage < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    total_users = @team.users.count
    if total_users > 0
      responding_users = User.joins(:teams, :responses)
                             .where(teams: { id: @team.id }, responses: { time_period_id: @time_periods })
                             .distinct
                             .count
      (responding_users.to_f / total_users * 100).round(2)
    else
      "No users available"
    end
  end
end
