class CreateRecipientShoutouts < ActiveRecord::Migration[7.0]
  def change
    create_table :recipient_shoutouts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :shoutout, foreign_key: true

      t.timestamps
    end
  end
end
