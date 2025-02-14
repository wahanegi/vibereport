class TeammateEngagementCount < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    receive_count = receive_teammate_engagement_count
    receive_count.zero? ? 'No teammate engagement count present' : receive_count
  end

  private

  def receive_teammate_engagement_count
    team_members = receive_team_members
    team_member_ids = team_members.pluck(0)
    team_member_names = team_members.pluck(1)
    comments = receive_shoutouts

    filter_comments(comments, team_member_ids, team_member_names).count
  end

  def receive_shoutouts
    Shoutout.where(time_period_id: @time_periods).pluck(:rich_text)
  end

  def receive_team_members
    if @team.nil?
      User.pluck(:id, Arel.sql("first_name || ' ' || last_name"))
    else
      @team.users.pluck(:id, Arel.sql("first_name || ' ' || last_name"))
    end
  end

  def filter_comments(comments, team_member_ids, team_member_names)
    comments.select do |comment|
      user_ids = Response.celebrate_user_ids_from_comment(comment)
      user_ids.intersect?(team_member_ids) || team_member_names.any? { |name| comment.include?(name) }
    end
  end
end
