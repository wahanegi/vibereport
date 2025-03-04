class CreateProjects < ActiveRecord::Migration[7.1]
  def change
    create_table :projects do |t|
      t.string :company
      t.string :code
      t.string :name

      t.timestamps
    end
    add_index :projects, :code, unique: true
  end
end
