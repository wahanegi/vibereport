class AdminReport
  def initialize(team)
    @team = team
    @responses =
    if @team
      Response.joins(user: { teams: :users_teams })
              .where(users_teams: { team_id: @team.id })
              .distinct
    else
      Response.all.distinct
    end
  end
end
