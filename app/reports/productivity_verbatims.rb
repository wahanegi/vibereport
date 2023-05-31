class ProductivityVerbatims < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    comments = {
      positive: [],
      neutral: [],
      negative: []
    }

    low_productivity_comments =
    if @team 
      Response.joins(user: :users_teams)
              .where(users_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods })
              .where('productivity <= ?', 2)
              .pluck(:comment)
    else
      comments.each_key do |emotion|
        comments[emotion] = Response.joins(:emotion)
                                    .where(responses: { time_period_id: @time_periods })
                                    .where(emotion: { category: emotion.to_s })
                                    .pluck(:comment)
                                    .compact
                                    .reject(&:empty?)
                                    .map { |str| str.gsub(/\r\n/, '') }
                                    .reject(&:empty?)
        comments[emotion] = comments[emotion].empty? ? 'No comments available' : comments[emotion].join(", ")
      end
    end
    if low_productivity_comments.empty?
      'No comments available'
    else
      low_productivity_comments
    end
  end
end
