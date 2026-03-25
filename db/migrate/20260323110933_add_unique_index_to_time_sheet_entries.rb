# frozen_string_literal: true

class AddUniqueIndexToTimeSheetEntries < ActiveRecord::Migration[7.2]
  disable_ddl_transaction! # avoid locking the table on large

  def up
    duplicate_count = execute(<<~SQL).first['count'].to_i
      SELECT COUNT(*) AS count
      FROM (
        SELECT user_id, time_period_id, project_id, COUNT(*) 
        FROM time_sheet_entries
        GROUP BY user_id, time_period_id, project_id
        HAVING COUNT(*) > 1
      ) AS duplicated_rows;
    SQL

    if duplicate_count.positive?
      puts "\n#{'!' * 100}"
      puts "!   MIGRATION STOPPED: Found #{duplicate_count} duplicate time_sheet_entries!"
      puts '!   You must clean duplicates before applying the unique index.'
      puts '!   Instructions:'
      puts '!     1. Open Rails console on production'
      puts '!     2. Run: Migrations::CleanDuplicateTimeSheetEntries.up'
      puts '!     3. Verify duplicates are removed:'
      puts '!        SELECT user_id, time_period_id, project_id, COUNT(*)'
      puts '!        FROM time_sheet_entries'
      puts '!        GROUP BY user_id, time_period_id, project_id'
      puts '!        HAVING COUNT(*) > 1;'
      puts '!     4. After cleanup, re-run: rails db:migrate'
      puts "#{'!' * 100}\n"

      # safety stop migrate
      raise StandardError, 'Duplicate time_sheet_entries detected. Migration halted.'
    end

    puts "\n== No duplicates found. Applying unique index to time_sheet_entries =="
    add_index :time_sheet_entries,
              %i[user_id time_period_id project_id],
              unique: true,
              name: 'index_unique_timesheet_entries'
    puts "\n== Unique index successfully added. =="
  end

  def down
    remove_index :time_sheet_entries, name: 'index_unique_timesheet_entries'
    puts "\n== Unique index removed. =="
  end
end
