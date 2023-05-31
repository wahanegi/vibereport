class ProductivityAverage < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    average_productivity = responses.average(:productivity)

    if average_productivity.nil?
      'No productivity available'
    else
      average_productivity.round(2)
    end
  end

  private

  def responses
    @responses ||= begin
      if @team
        Response.joins(user: { teams: :users_teams })
                .where(users_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods })
      else
        Response.where(time_period_id: @time_periods).distinct
      end
    end
  end
end
