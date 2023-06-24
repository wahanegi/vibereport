class AddDraftToResponses < ActiveRecord::Migration[7.0]
  def change
    add_column :responses, :draft, :boolean, default: false, null: false
  end
end
