class TeammateEngagementVerbatims < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    return 'No team provided' unless @team
    team_members = receive_team_members
    team_member_ids = team_members.pluck(0)
    team_member_names = team_members.pluck(1)

    shoutouts = filter_comments(receive_shoutouts, team_member_ids, team_member_names)
    celebrate_comments = filter_comments(receive_shoutouts('CelebrateShoutout'), team_member_ids, team_member_names)

    verbatim_list = format_comments(shoutouts + celebrate_comments)

    message_for(verbatim_list)
  end

  private

  def receive_shoutouts(type = nil)
    Shoutout.where(time_period_id: @time_periods, type: type).pluck(:rich_text)
  end

  def receive_team_members
    @team.users.pluck(:id, Arel.sql("first_name || ' ' || last_name"))
  end

  def filter_comments(comments, team_member_ids, team_member_names)
    comments.select do |comment|
      user_ids = Response.celebrate_user_ids_from_comment(comment)
      user_ids.intersect?(team_member_ids) || team_member_names.any? { |name| comment.include?(name) }
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
