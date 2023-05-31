class TeammateEngagementVerbatims < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    shoutouts = Shoutout.where(time_period_id: @time_periods).pluck(:rich_text)
    celebrate_comments = Response.where(time_period_id: @time_periods)
                                 .where.not(celebrate_comment: nil)
                                 .pluck(:celebrate_comment)

    team_members = User.joins(:users_teams)
                       .where(users_teams: { team_id: @team.id })
                       .pluck(:id, Arel.sql("first_name || ' ' || last_name"))

    team_member_ids = team_members.map { |member| member[0] }
    team_member_names = team_members.map { |member| member[1] }
    
    shoutouts = shoutouts.select do |shoutout|
      user_ids = User.extract_user_ids_from_comment(shoutout)
      (user_ids & team_member_ids).any? || team_member_names.any? { |name| shoutout.include?(name) }
    end

    celebrate_comments = celebrate_comments.select do |comment|
      user_ids = User.extract_user_ids_from_comment(comment)
      (user_ids & team_member_ids).any? || team_member_names.any? { |name| comment.include?(name) }
    end

    shoutouts = shoutouts.map { |shoutout| ActionView::Base.full_sanitizer.sanitize(shoutout) }
    celebrate_comments = celebrate_comments.map { |comment| comment.gsub(/\[(.*?)\]\(\d+\)/, '\1') }

    verbatim_list = shoutouts + celebrate_comments

    if verbatim_list.empty? || (verbatim_list.length == 1 && verbatim_list[0] == "")
      'No teammate engagement verbatims available'
    else
      verbatim_list
    end
  end
end