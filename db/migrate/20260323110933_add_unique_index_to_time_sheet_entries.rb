# frozen_string_literal: true

class AddUniqueIndexToTimeSheetEntries < ActiveRecord::Migration[7.2]
  disable_ddl_transaction!

  def up
    add_index :time_sheet_entries,
              %i[user_id time_period_id project_id],
              unique: true,
              name: 'index_unique_timesheet_entries'
  end

  def down
    remove_index :time_sheet_entries, name: 'index_unique_timesheet_entries'
  end
end
