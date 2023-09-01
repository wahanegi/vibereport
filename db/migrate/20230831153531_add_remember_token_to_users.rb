class AddRememberTokenToUsers < ActiveRecord::Migration[7.0]
  change_table :users do |t|
    t.string :remember_token, limit: 20
  end
end
