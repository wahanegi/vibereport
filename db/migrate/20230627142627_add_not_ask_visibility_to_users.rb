class AddNotAskVisibilityToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :not_ask_visibility, :boolean, default: false, null: false
  end
end
