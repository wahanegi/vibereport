class AddFieldVisibleToShoutouts < ActiveRecord::Migration[7.0]
  def change
    change_table :shoutouts, bulk: true do |t|
      t.column :visible, :boolean, default: true, null: false
      t.column :not_ask, :boolean, default: false, null: false
    end
  end
end
