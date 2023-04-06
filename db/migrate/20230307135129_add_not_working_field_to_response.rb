class AddNotWorkingFieldToResponse < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :not_working, :boolean, default: false
  end
end
