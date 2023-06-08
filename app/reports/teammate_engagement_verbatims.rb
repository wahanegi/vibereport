class TeammateEngagementVerbatims < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    return 'No team provided' unless @team

    team_members = receive_team_members
    team_member_ids = team_members.map { |member| member[0] }
    team_member_names = team_members.map { |member| member[1] }

    shoutouts = filter_comments(receive_shoutouts, team_member_ids, team_member_names)
    celebrate_comments = filter_comments(receive_celebrate_comments, team_member_ids, team_member_names)

    verbatim_list = format_comments(shoutouts + celebrate_comments)

    message_for(verbatim_list)
  end

  private

  def receive_shoutouts
    @receive_shoutouts ||= begin
      Shoutout.where(time_period_id: @time_periods).pluck(:rich_text)
    end
  end

  def receive_celebrate_comments
    @receive_celebrate_comments ||= begin
      Response.where(time_period_id: @time_periods)
              .celebrated
              .pluck(:celebrate_comment)
    end
  end

  def receive_team_members
    @receive_team_members ||= begin
      User.joins(:users_teams)
          .where(users_teams: { team_id: @team.id })
          .pluck(:id, Arel.sql("first_name || ' ' || last_name"))
    end
  end

  def filter_comments(comments, team_member_ids, team_member_names)
    comments.select do |comment|
      user_ids = Response.celebrate_user_ids_from_comment(comment)
      (user_ids & team_member_ids).any? || team_member_names.any? { |name| comment.include?(name) }
    end
  end

  def format_comments(comments)
    comments.map do |comment|
      sanitized_comment = ActionView::Base.full_sanitizer.sanitize(comment)
      if sanitized_comment.is_a?(String)
        sanitized_comment.gsub(/\[(.*?)\]\(\d+\)/, '\1')
      else
        sanitized_comment
      end
    end
  end

  def message_for(verbatim_list)
    if verbatim_list.empty? || (verbatim_list.length == 1 && verbatim_list[0] == '')
      'No teammate engagement verbatims present'
    else
      verbatim_list
    end
  end
end