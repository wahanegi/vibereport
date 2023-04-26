class AddPublicToEmotions < ActiveRecord::Migration[7.0]
  def change
    add_column :emotions, :public, :boolean, default: false
  end
end
