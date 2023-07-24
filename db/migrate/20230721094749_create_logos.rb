class CreateLogos < ActiveRecord::Migration[7.0]
  def change
    create_table :logos do |t|
      t.string :type, default: 'Logo'
      t.timestamps
    end
  end
end
