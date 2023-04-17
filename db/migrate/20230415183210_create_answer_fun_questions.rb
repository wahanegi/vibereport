class CreateAnswerFunQuestions < ActiveRecord::Migration[7.0]
  def change
    create_table :answer_fun_questions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :response, null: false, foreign_key: true
      t.references :fun_question, null: false, foreign_key: true
      t.text :answer_body

      t.timestamps
    end
  end
end
