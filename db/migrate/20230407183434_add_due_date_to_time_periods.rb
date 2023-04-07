class AddDueDateToTimePeriods < ActiveRecord::Migration[7.0]
  def change
    add_column :time_periods, :due_date, :date
  end
end
