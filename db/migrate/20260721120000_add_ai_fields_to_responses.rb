class AddAiFieldsToResponses < ActiveRecord::Migration[7.2]
  def change
    add_column :responses, :ai_question, :string
    add_column :responses, :ai_answer, :text
  end
end
