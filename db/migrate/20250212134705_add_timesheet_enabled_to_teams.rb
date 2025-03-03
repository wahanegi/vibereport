class AddTimesheetEnabledToTeams < ActiveRecord::Migration[7.2]
  def change
    add_column :teams, :timesheet_enabled, :boolean, default: false, null: false
  end
end
