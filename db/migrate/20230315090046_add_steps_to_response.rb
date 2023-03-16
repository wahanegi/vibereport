class AddStepsToResponse < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :steps, :string
  end
end
