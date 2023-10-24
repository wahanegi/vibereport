class UpdateExistingShoutoutsToFalse < ActiveRecord::Migration[7.0]
  def up
    Shoutout.update_all(public: false)
  end
end
