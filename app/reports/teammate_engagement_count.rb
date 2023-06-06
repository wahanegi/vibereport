class TeammateEngagementCount < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    teammate_engagement_count = receive_teammate_engagement_count
    teammate_engagement_count.zero? ? 'No teammate engagement count available' : teammate_engagement_count
  end

  private

  def receive_teammate_engagement_count
    if @team
      @team.users.joins(:shoutouts)
           .where(shoutouts: { time_period_id: @time_periods })
           .count
    else
      User.joins(:shoutouts)
          .where(shoutouts: { time_period_id: @time_periods })
          .count
    end
  end
end
