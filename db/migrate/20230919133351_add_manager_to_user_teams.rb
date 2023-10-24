class AddManagerToUserTeams < ActiveRecord::Migration[7.0]
  def change
    add_column :user_teams, :manager, :boolean, default: false, null: false
  end
end
