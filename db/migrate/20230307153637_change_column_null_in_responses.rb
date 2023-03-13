class ChangeColumnNullInResponses < ActiveRecord::Migration[7.0]
  def change
    change_column_null(:responses, :emotion_id, true)
  end
end
