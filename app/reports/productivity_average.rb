class ProductivityAverage < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    average_productivity = receive_responses.average(:productivity)

    average_productivity.nil? ? 'No productivity present' : average_productivity.round(2)
  end

  private

  def receive_responses
    if @team
      Response.joins(user: { teams: :users_teams })
              .where(users_teams: { team_id: @team.id }, responses: { time_period_id: @time_periods })
    else
      Response.where(responses: { time_period_id: @time_periods }).distinct
    end
  end
end
