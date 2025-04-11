class AddUsageToProjects < ActiveRecord::Migration[7.2]
  def change
    add_column :projects, :usage, :integer, default: 0, null: false
  end
end
