class DropNotifications < ActiveRecord::Migration[7.2]
  def up
    drop_table :notifications, if_exists: true
  end

  def down
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.text :details
      t.boolean :viewed, null: false, default: false
      t.timestamps
    end
  end
end
