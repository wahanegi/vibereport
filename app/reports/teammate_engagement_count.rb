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
    return 0 unless @team

    team_member_ids = receive_team_members.map { |member| member[0] }
    team_member_names = receive_team_members.map { |member| member[1] }

    shoutouts = filter_comments(receive_shoutouts, team_member_ids, team_member_names)
    celebrate_comments = filter_comments(receive_celebrate_comments, team_member_ids, team_member_names)

    shoutouts.count + celebrate_comments.count
  end

  def receive_shoutouts
    Shoutout.where(time_period_id: @time_periods).pluck(:rich_text)
  end

  def receive_celebrate_comments
    Response.where(time_period_id: @time_periods)
            .where.not(celebrate_comment: nil)
            .pluck(:celebrate_comment)
  end

  def receive_team_members
    User.joins(:user_teams)
        .where(user_teams: { team_id: @team.id })
        .pluck(:id, Arel.sql("first_name || ' ' || last_name"))
  end

  def filter_comments(comments, team_member_ids, team_member_names)
    comments.select do |comment|
      user_ids = Response.celebrate_user_ids_from_comment(comment)
      (user_ids & team_member_ids).any? || team_member_names.any? { |name| comment.include?(name) }
    end
  end
end
