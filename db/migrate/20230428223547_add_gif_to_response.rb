class AddGifToResponse < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :gif, :jsonb
  end
end
