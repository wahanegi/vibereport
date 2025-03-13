class CreateTimeSheetEntries < ActiveRecord::Migration[7.1]
  def change
    create_table :time_sheet_entries do |t|
      t.references :user, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.references :time_period, null: false, foreign_key: true
      t.integer :total_hours, null: false

      t.timestamps
    end
  end
end
