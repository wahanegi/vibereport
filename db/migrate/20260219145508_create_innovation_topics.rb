class CreateInnovationTopics < ActiveRecord::Migration[7.2]
  def change
    create_table :innovation_topics do |t|
      t.text :innovation_body, null: false
      t.boolean :posted, default: false, null: false
      t.references :user, null: false, foreign_key: true
      t.references :time_period, null: true, foreign_key: true

      t.timestamps
    end
  end
end
