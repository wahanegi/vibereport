# frozen_string_literal: true

module Migrations
  # Removes duplicate time_sheet_entries rows before adding a unique index.
  # Keeps the row with the smallest id for each (user_id, time_period_id, project_id) combination.
  class CleanDuplicateTimeSheetEntries
    BATCH_SIZE = 1000

    # Anonymous model to avoid coupling to TimeSheetEntry at migration run time
    ROW_MODEL = Class.new(ApplicationRecord) { self.table_name = 'time_sheet_entries' }
    private_constant :ROW_MODEL

    class << self
      def up
        puts 'Start cleaning duplicate TimeSheetEntries...'

        total_deleted = 0

        # Select unique combinations and keep smallest id
        ROW_MODEL
          .select('MIN(id) as keep_id, user_id, time_period_id, project_id')
          .group(:user_id, :time_period_id, :project_id)
          .map { |row| [row.keep_id, row.user_id, row.time_period_id, row.project_id] }
          .each do |keep_id, user_id, time_period_id, project_id|
          deleted_count = ROW_MODEL
                          .where(user_id: user_id, time_period_id: time_period_id, project_id: project_id)
                          .where.not(id: keep_id)
                          .delete_all
          total_deleted += deleted_count
        end

        puts "Completed cleaning duplicates. Total rows deleted: #{total_deleted}"
      end
    end
  end
end
