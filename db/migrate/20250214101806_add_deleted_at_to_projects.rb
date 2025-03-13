class AddDeletedAtToProjects < ActiveRecord::Migration[7.2]
  def change
    add_column :projects, :deleted_at, :date
  end
end
