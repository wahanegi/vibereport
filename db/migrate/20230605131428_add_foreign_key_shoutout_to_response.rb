class AddForeignKeyShoutoutToResponse < ActiveRecord::Migration[7.0]
  def change
    add_reference :responses, :shoutout, null: true, foreign_key: true
  end
end
