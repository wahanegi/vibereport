class RemoveManagerFromUser < ActiveRecord::Migration[7.0]
  def up
    remove_column :users, :manager
  end

  def down
    add_column :users, :manager, :boolean, null: false, default: false
  end
end
