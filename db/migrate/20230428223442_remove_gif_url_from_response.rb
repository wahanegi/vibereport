class RemoveGifUrlFromResponse < ActiveRecord::Migration[7.0]
  def change
    remove_column :responses, :gif_url
  end
end
