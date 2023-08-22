class RenameBadFollowCommentToProductivityComment < ActiveRecord::Migration[7.0]
  def change
    rename_column :responses, :bad_follow_comment, :productivity_comment
  end
end
