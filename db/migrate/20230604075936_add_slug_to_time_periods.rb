class AddSlugToTimePeriods < ActiveRecord::Migration[7.0]
  def change
    add_column :time_periods, :slug, :string
    add_index :time_periods, :slug, unique: true
  end
end
