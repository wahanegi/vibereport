class CelebrationsCount < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    celebrate_comments_count = celebrate_comments.count
    celebrate_comments_count.zero? ? 'No celebrate count available' : celebrate_comments_count
  end

  private

  def celebrate_comments
    celebrate_comment = Response.where(responses: { time_period_id: @time_periods }).where.not(celebrate_comment: [nil, ''])

    @team ? celebrate_comment.joins(user: :users_teams).where(users_teams: { team_id: @team.id }) : celebrate_comment
  end
end
