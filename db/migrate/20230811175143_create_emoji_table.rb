class CreateEmojiTable < ActiveRecord::Migration[7.0]
  def change
    create_table :emojis do |t|
      t.string :emoji_code
      t.string :emoji_name
      t.references :user
      t.references :emojiable, polymorphic: true

      t.timestamps
    end

    add_index :emojis, %i[emoji_code user_id emojiable_type emojiable_id], unique: true, name: 'index_unique_emojis'
  end
end
