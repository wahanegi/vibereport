class AddTimePeriodIndexToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :time_period_index, :integer, default: 0
  end
end
