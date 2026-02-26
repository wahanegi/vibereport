class AddInnovationBrainstormingToResponses < ActiveRecord::Migration[7.2]
  def change
    add_reference :responses, :innovation_brainstorming, null: true, foreign_key: true
  end
end
