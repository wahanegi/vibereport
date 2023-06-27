class CreateTeams < ActiveRecord::Migration[7.0]
  def change
    create_table :teams do |t|
      t.string :name, unique: true, limit: 100, null: false

      t.timestamps
    end
    add_index :teams, :name, unique: true
  end
end
