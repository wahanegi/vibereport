class SetExistingProjectsToBillable < ActiveRecord::Migration[7.2]
  def up
    Project.update_all(usage: 1)
  end

  def down
    Project.update_all(usage: 0)
  end
end
