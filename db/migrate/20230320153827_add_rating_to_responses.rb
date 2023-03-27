class AddRatingToResponses < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :rating, :integer
    add_column :responses, :comment, :text
  end
end
