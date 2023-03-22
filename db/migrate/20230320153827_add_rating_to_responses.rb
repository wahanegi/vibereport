class AddRatingToResponses < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :rating, :integer
  end
end
