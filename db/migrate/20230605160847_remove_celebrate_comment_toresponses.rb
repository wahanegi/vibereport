class RemoveCelebrateCommentToresponses < ActiveRecord::Migration[7.0]
  def change
    remove_column :responses, :celebrate_comment
  end
end
