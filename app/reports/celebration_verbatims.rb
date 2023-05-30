class CelebrationVerbatims < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    celebrate_comments = Response.joins(user: :users_teams)
                                 .where(users_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods })
                                 .where.not(celebrate_comment: nil)
                                 .pluck(:celebrate_comment)

    if celebrate_comments.empty? || (celebrate_comments.length == 1 && celebrate_comments[0] == "")
      'No celebrate comments available'
    else
      celebrate_comments
    end
  end
end
