# == Schema Information
#
# Table name: shoutouts
#
#  id             :bigint           not null, primary key
#  digest         :bigint           not null
#  recipients     :string
#  rich_text      :text             not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  time_period_id :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_shoutouts_on_digest          (digest) UNIQUE
#  index_shoutouts_on_time_period_id  (time_period_id)
#  index_shoutouts_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :shoutout do
    association :user, factory: :user
    association :time_period, factory: :time_period
  end
end
