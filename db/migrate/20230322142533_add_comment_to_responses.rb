class AddCommentToResponses < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :comment, :string
  end
end
