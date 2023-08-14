class CreateEmojiTable < ActiveRecord::Migration[7.0]
  def change
    create_table :emojis do |t|
      t.string :emoji_code
      t.string :emoji_name
      t.references :user
      t.references :emojiable, polymorphic: true

      t.timestamps
    end
  end
end
