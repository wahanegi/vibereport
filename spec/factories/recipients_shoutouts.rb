# == Schema Information
#
# Table name: recipients_shoutouts
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  shoutouts_id :bigint
#  user_id      :bigint           not null
#
# Indexes
#
#  index_recipients_shoutouts_on_shoutouts_id  (shoutouts_id)
#  index_recipients_shoutouts_on_user_id       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (shoutouts_id => shoutouts.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :recipients_shoutout do
    user_id { 1 }
  end
end
