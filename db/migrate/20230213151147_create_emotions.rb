class CreateEmotions < ActiveRecord::Migration[7.0]
  def change
    create_table :emotions do |t|
      t.string :word
      t.integer :category, default: 1

      t.timestamps
    end
  end
end
