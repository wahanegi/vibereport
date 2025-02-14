class ShoutoutAuthorReport < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    shoutout_user_names.tally
  end

  private

  def shoutout_user_names
    users = @team.users.select(:id, :first_name, :last_name).to_a

    Shoutout.joins(user: { user_teams: :team })
            .where(user: { user_teams: { team_id: @team.id } })
            .where(time_period: @time_periods)
            .pluck(:user_id)
            .map { |id| users.find { |u| u.id == id }.full_name }
  end
end