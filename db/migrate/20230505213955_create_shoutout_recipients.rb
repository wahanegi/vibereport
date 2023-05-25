class CreateShoutoutRecipients < ActiveRecord::Migration[7.0]
  def change
    create_table :shoutout_recipients do |t|
      t.references :user, null: false, foreign_key: true
      t.references :shoutout, null: false, foreign_key: true

      t.timestamps
    end
  end
end
