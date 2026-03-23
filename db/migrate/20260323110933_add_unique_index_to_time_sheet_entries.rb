class AddUniqueIndexToTimeSheetEntries < ActiveRecord::Migration[7.2]
  def change
    add_index :time_sheet_entries,
              %i[user_id time_period_id project_id],
              unique: true,
              name: 'index_unique_timesheet_entries'
  end
end
