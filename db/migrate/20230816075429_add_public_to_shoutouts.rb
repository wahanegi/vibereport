class AddPublicToShoutouts < ActiveRecord::Migration[7.0]
  def change
    add_column :shoutouts, :public, :boolean, default: false, null: false
  end
end
