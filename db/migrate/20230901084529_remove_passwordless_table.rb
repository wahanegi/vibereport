class RemovePasswordlessTable < ActiveRecord::Migration[7.0]
  def up
    drop_table :passwordless_sessions
  end

  def down
    create_table(:passwordless_sessions) do |t|
      t.belongs_to(:authenticatable, polymorphic: true, index: { name: 'authenticatable' })
      t.datetime(:timeout_at, null: false)
      t.datetime(:expires_at, null: false)
      t.datetime(:claimed_at)
      t.text(:user_agent, null: false)
      t.string(:remote_addr, null: false)
      t.string(:token, null: false)
      t.timestamps
    end
  end
end
