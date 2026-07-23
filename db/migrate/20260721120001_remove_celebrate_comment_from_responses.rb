class RemoveCelebrateCommentFromResponses < ActiveRecord::Migration[7.2]
  disable_ddl_transaction!

  def up
    remove_column :responses, :celebrate_comment
  end

  def down
    add_column :responses, :celebrate_comment, :string
  end
end
