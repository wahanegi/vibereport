class AddProductivityToResponses < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :productivity, :integer
  end
end
