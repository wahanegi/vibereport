# == Schema Information
#
# Table name: recipient_shoutouts
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  shoutout_id :bigint
#  user_id     :bigint           not null
#
# Indexes
#
#  index_recipient_shoutouts_on_shoutout_id  (shoutout_id)
#  index_recipient_shoutouts_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (shoutout_id => shoutouts.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :shoutout_recipient do
    association :user, factory: :user
    association :shoutout, factory: :shoutout
  end
end
