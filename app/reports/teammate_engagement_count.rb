class TeammateEngagementCount < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    receive_teammate_engagement_count.zero? ? 'No teammate engagement count present' : receive_teammate_engagement_count
  end

  private

  def receive_teammate_engagement_count
    teammate_ids = @team ? @team.users.ids : User.ids
    shoutout_count(teammate_ids) + celebrate_comments_count(teammate_ids)
  end

  def shoutout_count(teammate_ids)
    Shoutout.where(user_id: teammate_ids, time_period_id: @time_periods).count
  end

  def celebrate_comments_count(teammate_ids)
    Response.joins(:user)
            .where(users: { id: teammate_ids })
            .where.not(celebrate_comment: nil)
            .where(time_period_id: @time_periods)
            .count
  end
end
