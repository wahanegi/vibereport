class CreateShoutouts < ActiveRecord::Migration[7.0]
  def change
    create_table :shoutouts do |t|
      t.text :rich_text, null: false
      t.string :recipients
      t.references :user, null: false, foreign_key: true
      t.references :time_period, null: false, foreign_key: true
      t.bigint :digest, null: false, unique: true

      t.timestamps
    end
    add_index :shoutouts, :digest, unique: true
  end
end
