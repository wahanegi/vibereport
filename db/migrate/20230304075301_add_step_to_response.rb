class AddStepToResponse < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :step, :string
  end
end
