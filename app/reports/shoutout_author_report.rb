class ShoutoutAuthorReport < AdminReport
  def initialize(team, time_periods)
    super(team)
    @time_periods = time_periods
  end

  def generate
    shoutout_user_names.reduce({}) { |hash, shoutout| hash.merge({ shoutout.user_full_name => shoutout.total_shoutouts }) }
  end

  private

  def shoutout_user_names
    Shoutout.joins(user: { user_teams: :team })
            .where(user_teams: { team_id: @team.id })
            .where(time_period: @time_periods)
            .select("users.first_name || ' ' || users.last_name AS user_full_name, COUNT(*) AS total_shoutouts")
            .group("users.first_name, users.last_name")
  end
end