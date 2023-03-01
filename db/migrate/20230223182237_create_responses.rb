class CreateResponses < ActiveRecord::Migration[7.0]
  def change
    create_table :responses do |t|
      t.references :time_period, null: false, foreign_key: true
      t.references :emotion, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
    add_index :responses, [:user_id, :time_period_id]
  end
end
