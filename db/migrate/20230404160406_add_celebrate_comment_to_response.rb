class AddCelebrateCommentToResponse < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :celebrate_comment, :text
  end
end
