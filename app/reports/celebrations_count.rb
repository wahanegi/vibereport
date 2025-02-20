class CelebrationsCount < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    celebrate_comments_count = celebrate_comments.count
    celebrate_comments_count.zero? ? 'No celebrate count present' : celebrate_comments_count
  end

  private

  def celebrate_comments
    celebrate_comment = Response.where(responses: { time_period_id: @time_periods })
                                .celebrated

    return celebrate_comment unless @team

    celebrate_comment.joins(user: { teams: :user_teams })
                     .where(user_teams: { team_id: @team.id })
                     .distinct
  end
end
