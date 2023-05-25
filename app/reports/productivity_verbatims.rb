class ProductivityVerbatims < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    low_productivity_comments = Response.joins(user: :users_teams)
                                        .where(users_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods })
                                        .where('productivity <= ?', 2)
                                        .pluck(:comment)

    if low_productivity_comments.empty?
      "No comments available"
    else
      low_productivity_comments
    end
  end
end
