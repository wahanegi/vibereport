class CreateShoutouts < ActiveRecord::Migration[7.0]
  def change
    create_table :shoutouts do |t|
      t.text :rich_text
      t.string :recipients
      t.references :user, null: false, foreign_key: true
      t.references :time_period, null: false, foreign_key: true

      t.timestamps
    end
    add_index :shoutouts, [:user_id, :time_period_id], unique: true
  end
end
