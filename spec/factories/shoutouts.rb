# == Schema Information
#
# Table name: shoutouts
#
#  id             :bigint           not null, primary key
#  recipients     :string
#  rich_text      :text
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  time_period_id :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_shoutouts_on_time_period_id              (time_period_id)
#  index_shoutouts_on_user_id                     (user_id)
#  index_shoutouts_on_user_id_and_time_period_id  (user_id,time_period_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :shoutout do
    rich_text { "MyText" }
    recipients { "MyString" }
  end
end
