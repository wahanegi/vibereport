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
    if @team
      teammate_ids = @team.users.ids
    else
      teammate_ids = User.ids
    end
  
    shoutout_count = Shoutout.where(user_id: teammate_ids, time_period_id: @time_periods).count
  
    celebrate_comments_count = Response
                                 .joins(:user)
                                 .where(users: { id: teammate_ids })
                                 .where.not(celebrate_comment: nil)
                                 .where(time_period_id: @time_periods)
                                 .count
  
    shoutout_count + celebrate_comments_count
  end
end
