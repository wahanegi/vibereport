class CelebrationsCount < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    celebrate_comments_count = if @team
      Response.joins(user: :users_teams)
              .where(users_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods })
              .where.not(celebrate_comment: [nil, ''])
              .count
    else
      Response.where(responses: { time_period_id: @time_periods })
              .where.not(celebrate_comment: [nil, ''])
              .count
    end

    if celebrate_comments_count == 0
      'No celebrate comments available'
    else
      celebrate_comments_count
    end
  end
end
