class CelebrationVerbatims < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    return 'No team provided' unless @team

    celebrate_comments = receive_celebrate_comments.compact.reject(&:empty?)

    return 'No celebrate comments available' if celebrate_comments.empty?

    celebrate_comments
  end

  private

  def receive_celebrate_comments
    Response.joins(user: :users_teams)
            .where(users_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods })
            .where.not(celebrate_comment: nil)
            .pluck(:celebrate_comment)
  end
end
