class ProductivityVerbatims < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    low_productivity_comments = receive_low_productivity_comments

    low_productivity_comments.empty? ? 'No comments present' : low_productivity_comments
  end

  def receive_comments(emotion)
    @comments ||= {}
    @comments[emotion] ||= fetch_comments(emotion)
  end

  private

  def receive_low_productivity_comments
    return team_not_present if @team.nil?

    Response.joins(user: :user_teams)
            .where(user_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods })
            .where('productivity <= ?', 2)
            .where.not(bad_follow_comment: [''])
            .pluck(:bad_follow_comment)
  end

  def team_not_present
    comments = { positive: [], neutral: [], negative: [] }

    comments.each_key do |emotion|
      comments[emotion] += receive_comments(emotion)
      comments[emotion] = comments[emotion].empty? ? 'No bad follow comment present' : comments[emotion].join('||')
    end
    comments
  end

  def fetch_comments(emotion)
    Response.joins(:emotion)
            .where(responses: { time_period_id: @time_periods })
            .where(emotion: { category: emotion.to_s })
            .where.not(bad_follow_comment: [''])
            .pluck(:bad_follow_comment)
  end
end
