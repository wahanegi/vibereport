class AddNotNullConstraintsToProjects < ActiveRecord::Migration[7.2]
  def change
    change_table :projects, bulk: true do |t|
      t.change_null :code, false
      t.change_null :company, false
      t.change_null :name, false
    end
  end
end
