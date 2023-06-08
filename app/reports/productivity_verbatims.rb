class ProductivityVerbatims < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    low_productivity_comments = receive_low_productivity_comments

    low_productivity_comments.empty? ? 'No comments present' : low_productivity_comments
  end

  private

  def receive_low_productivity_comments
    return team_not_present if @team.nil?
  
    Response.joins(user: :users_teams)
            .where(users_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods })
            .where('productivity <= ?', 2)
            .pluck(:comment)
  end
  
  def team_not_present
    comments = { positive: [], neutral: [], negative: [] }
    
    comments.each_key do |emotion|
      comments[emotion] += receive_comments(emotion)
      comments[emotion] = comments[emotion].empty? ? 'No comments present' : comments[emotion].join(', ')
    end    
    comments
  end

  def receive_comments(emotion)
    @comments ||= {}
    @comments[emotion] ||= begin
      Response.joins(:emotion)
              .where(responses: { time_period_id: @time_periods })
              .where(emotion: { category: emotion.to_s })
              .pluck(:comment)
              .compact
              .reject(&:empty?)
              .map { |str| str.gsub(/\r\n/, '') }
              .reject(&:empty?)
    end
  end
end
