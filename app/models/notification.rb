# == Schema Information
#
# Table name: notifications
#
#  id         :bigint           not null, primary key
#  details    :text
#  viewed     :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_notifications_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Notification < ApplicationRecord
  belongs_to :user
  validates :details, presence: true

  scope :not_viewed, -> { where(viewed: false) }

  def self.ransackable_associations(_auth_object = nil)
    ["user"]
  end

  def self.ransackable_attributes(_auth_object = nil)
    %w[created_at details id id_value updated_at user_id viewed]
  end
end
