class AddBadFollowCommentToResponse < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :bad_follow_comment, :text
  end
end
