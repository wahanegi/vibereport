class ProductivityVerbatims < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    low_productivity_comments = receive_low_productivity_comments

    low_productivity_comments.empty? ? 'No productivity comment present' : low_productivity_comments
  end

  def receive_comments
    @receive_comments ||= fetch_comments
  end

  private

  def receive_low_productivity_comments
    return team_not_present if @team.nil?

    Response.joins(user: :user_teams)
            .where(user_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods })
            .where('productivity <= ?', 2)
            .where.not(productivity_comment: [''])
            .pluck(:productivity_comment)
  end

  def team_not_present
    combined_comments = receive_comments
    receive_comments.empty? ? 'No productivity comment present' : combined_comments.join('||')
  end

  def fetch_comments
    Response.joins(:emotion)
            .where(responses: { time_period_id: @time_periods })
            .where('productivity <= ?', 2)
            .where.not(productivity_comment: [''])
            .pluck(:productivity_comment)
  end
end
