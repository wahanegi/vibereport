class AddManagerToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :manager, :boolean, default: false
  end
end
