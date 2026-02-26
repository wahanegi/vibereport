class CreateInnovationBrainstormings < ActiveRecord::Migration[7.2]
  def change
    create_table :innovation_brainstormings do |t|
      t.text :brainstorming_body, null: false
      t.references :user, null: false, foreign_key: true
      t.references :innovation_topic, null: false, foreign_key: true

      t.timestamps
    end

    add_index :innovation_brainstormings, %i[user_id innovation_topic_id], unique: true,
                                                                           name: 'index_unique_brainstorm_on_user_and_topic'
  end
end
