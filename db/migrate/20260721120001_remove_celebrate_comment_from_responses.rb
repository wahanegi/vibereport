class RemoveCelebrateCommentFromResponses < ActiveRecord::Migration[7.2]
  def change
    remove_column :responses, :celebrate_comment, :string
  end
end
