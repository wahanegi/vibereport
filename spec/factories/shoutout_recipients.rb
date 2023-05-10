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
FactoryBot.define do
  factory :shoutout_recipient do
    user
    shoutout
  end
end
