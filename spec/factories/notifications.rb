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
FactoryBot.define do
  factory :notification do
    user
    details { Faker::Lorem.sentences }
  end
end
