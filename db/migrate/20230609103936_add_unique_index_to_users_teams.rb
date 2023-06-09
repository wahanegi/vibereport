class AddUniqueIndexToUsersTeams < ActiveRecord::Migration[7.0]
  def change
    add_index :users_teams, [:user_id, :team_id], unique: true
  end
end
