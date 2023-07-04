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
    celebrate_comment = Shoutout.where(shoutouts: { time_period_id: @time_periods, type: 'CelebrateShoutout' })

    @team ? celebrate_comment.joins(user: :user_teams).where(user_teams: { team_id: @team.id }) : celebrate_comment
  end
end
