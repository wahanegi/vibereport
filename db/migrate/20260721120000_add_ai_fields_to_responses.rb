class AddAiFieldsToResponses < ActiveRecord::Migration[7.2]
  disable_ddl_transaction!

  def up
    add_column :responses, :ai_question, :string
    add_column :responses, :ai_answer, :text
  end

  def down
    remove_column :responses, :ai_answer
    remove_column :responses, :ai_question
  end
end
