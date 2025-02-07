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
    team_member_ids = receive_team_members.map { |member| member[0] }
    team_member_names = receive_team_members.map { |member| member[1] }

    teammate_engagement_all = filter_comments(receive_shoutouts, team_member_ids, team_member_names)

    teammate_engagement_all.count
  end

  def receive_shoutouts
    Shoutout.where(time_period_id: @time_periods).pluck(:rich_text)
  end

  def receive_team_members
    if @team.nil?
      User.pluck(:id, Arel.sql("first_name || ' ' || last_name"))
    else
      User.joins(:user_teams)
          .where(user_teams: { team_id: @team.id })
          .pluck(:id, Arel.sql("first_name || ' ' || last_name"))
    end
  end

  def filter_comments(comments, team_member_ids, team_member_names)
    comments.select do |comment|
      user_ids = Response.celebrate_user_ids_from_comment(comment)
      user_ids.intersect?(team_member_ids) || team_member_names.any? { |name| comment.include?(name) }
    end
  end
end
