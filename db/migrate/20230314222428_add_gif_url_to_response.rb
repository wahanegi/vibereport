class AddGifUrlToResponse < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :gif_url, :string
  end
end
