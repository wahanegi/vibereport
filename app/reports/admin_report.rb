class AdminReport
  attr_reader :team

  def initialize(team = nil)
    @team = team
    @responses = if @team
                   Response.joins(user: { teams: :user_teams })
                           .where(user_teams: { team_id: @team.id })
                           .distinct
                 else
                   Response.all
                 end
  end
end
