class AddStepToResponse < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :step, :string
    add_column :responses, :word, :string
    add_column :responses, :category, :string

  end
end
