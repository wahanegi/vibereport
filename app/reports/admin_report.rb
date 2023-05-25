class AdminReport
  def initialize(team)
    @team = team
    @responses = Response.joins(user: { teams: :users_teams })
                         .where(users_teams: { team_id: @team.id })
                         .distinct
  end
end