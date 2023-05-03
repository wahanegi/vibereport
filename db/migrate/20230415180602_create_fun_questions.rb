class CreateFunQuestions < ActiveRecord::Migration[7.0]
  def change
    create_table :fun_questions do |t|
      t.references :user, null: true, foreign_key: true
      t.references :time_period, null: true, foreign_key: true
      t.string :question_body
      t.boolean :used, default: false, null: false
      t.boolean :public, default: false, null: false

      t.timestamps
    end

    add_index :fun_questions, :question_body, unique: true
  end
end
