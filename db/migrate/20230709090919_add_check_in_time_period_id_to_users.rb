class AddCheckInTimePeriodIdToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :check_in_time_period_id, :integer
  end
end
