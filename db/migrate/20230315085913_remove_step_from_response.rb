class RemoveStepFromResponse < ActiveRecord::Migration[7.0]
  def change
    remove_column :responses, :step, :string
  end
end
