class AddTypeToShoutouts < ActiveRecord::Migration[7.0]
  def change
    add_column :shoutouts, :type, :string
  end
end
