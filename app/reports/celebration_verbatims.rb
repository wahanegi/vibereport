class CelebrationVerbatims < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    return 'No team provided' unless @team

    celebrate_comments = receive_celebrate_comments

    return 'No celebrate comments present' if celebrate_comments.empty?

    celebrate_comments
  end

  private

  def receive_celebrate_comments
    Response.joins(user: :user_teams)
            .where(user_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods })
            .celebrated
            .pluck(:celebrate_comment)
            .compact_blank
  end
end
