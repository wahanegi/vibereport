class AddCelebrateCommentToResponses < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :celebrate_comment, :string
  end
end
