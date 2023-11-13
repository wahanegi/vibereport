# == Schema Information
#
# Table name: shoutout_recipients
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  shoutout_id :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_shoutout_recipients_on_shoutout_id  (shoutout_id)
#  index_shoutout_recipients_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (shoutout_id => shoutouts.id)
#  fk_rails_...  (user_id => users.id)
#
class ShoutoutRecipient < ApplicationRecord
  belongs_to :shoutout
  belongs_to :user

  def self.ransackable_attributes(_auth_object = nil)
    %w[created_at id id_value shoutout_id updated_at user_id]
  end
end
