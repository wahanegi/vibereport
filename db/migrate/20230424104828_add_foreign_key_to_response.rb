class AddForeignKeyToResponse < ActiveRecord::Migration[7.0]
  def change
    add_reference :responses, :fun_question_answer, foreign_key: true
    add_reference :responses, :fun_question, null: true, foreign_key: true
  end
end
