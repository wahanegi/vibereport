class CreateFunQuestionAnswers < ActiveRecord::Migration[7.0]
  def change
    create_table :fun_question_answers do |t|
      t.references :user, null: false, foreign_key: true
      t.references :fun_question, null: false, foreign_key: true
      t.text :answer_body

      t.timestamps
    end
  end
end
