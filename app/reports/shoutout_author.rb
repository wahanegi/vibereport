class ShoutoutAuthor
  def initialize(team, time_periods, previous_time_periods)
    @team = team
    @time_periods = time_periods
    @previous_time_periods = previous_time_periods
  end

  def generate
    shoutout_user_names = shoutout_users_full_names(@time_periods)

    total_shoutouts = shoutout_user_names.size
    previous_total_shoutouts = shoutout_users_full_names(@previous_time_periods).size

    [total_shoutouts, previous_total_shoutouts, shoutout_user_names.tally]
  end

  private

  def shoutout_users_full_names(time_periods)
    Shoutout.includes(:user)
            .where(user: @team.users)
            .where(time_period: time_periods)
            .map { |shoutout| shoutout.user.full_name }
  end
end