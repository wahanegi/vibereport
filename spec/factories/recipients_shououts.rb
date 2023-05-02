# == Schema Information
#
# Table name: recipients_shououts
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  shoutouts_id :bigint
#  user_id      :integer
#
# Indexes
#
#  index_recipients_shououts_on_shoutouts_id  (shoutouts_id)
#
# Foreign Keys
#
#  fk_rails_...  (shoutouts_id => shoutouts.id)
#
FactoryBot.define do
  factory :recipients_shouout do
    user_id { 1 }
    shoutouts_id { 1 }
  end
end
