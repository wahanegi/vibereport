class AddSortOrderToInnovationTopics < ActiveRecord::Migration[7.2]
  def up
    add_column :innovation_topics, :sort_order, :integer
    execute 'UPDATE innovation_topics SET sort_order = id * 10'
    change_column_null :innovation_topics, :sort_order, false
  end

  def down
    remove_column :innovation_topics, :sort_order
  end
end
