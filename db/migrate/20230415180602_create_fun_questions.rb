class CreateFunQuestions < ActiveRecord::Migration[7.0]
  def change
    create_table :fun_questions do |t|
      t.references :user, null: true, foreign_key: true
      t.references :response, null: true, foreign_key: true
      t.text :question_body
      t.boolean :used, default: false, null: false
      t.boolean :public, default: false, null: false

      t.timestamps
    end
  end
end
