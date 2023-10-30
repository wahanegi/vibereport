class MoveUserManagersToUserTeams < ActiveRecord::Migration[7.0]
  def up
    User.where(manager: true).each { |user| user.user_teams.update_all(manager: true) }
  end
end
