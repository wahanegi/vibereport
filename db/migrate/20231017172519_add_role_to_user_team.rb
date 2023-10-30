class AddRoleToUserTeam < ActiveRecord::Migration[7.0]
  def change
    add_column :user_teams, :role, :integer, default: 0, null: false
  end
end
