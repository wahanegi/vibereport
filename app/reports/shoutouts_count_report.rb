class ShoutoutsCountReport < AdminReport

  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    total_shoutouts_count
  end

  private

  def total_shoutouts_count
    query = Shoutout.where(time_period: @time_periods)

    if @team
      query = query.joins(user: { user_teams: :team })
                   .where(user_teams: { team_id: @team.id })
    end

    query.count
  end
end