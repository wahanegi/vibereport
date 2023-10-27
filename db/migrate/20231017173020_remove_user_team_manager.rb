class RemoveUserTeamManager < ActiveRecord::Migration[7.0]
  def up
    remove_column :user_teams, :manager
  end

  def down
    add_column :user_teams, :manager, :boolean, default: false, null: false
  end
end
