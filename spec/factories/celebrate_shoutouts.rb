# == Schema Information
#
# Table name: shoutouts
#
#  id             :bigint           not null, primary key
#  public         :boolean          default(TRUE), not null
#  rich_text      :text             not null
#  type           :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  time_period_id :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_shoutouts_on_rich_text_and_user_id_and_time_period_id  (rich_text,user_id,time_period_id) UNIQUE
#  index_shoutouts_on_time_period_id                            (time_period_id)
#  index_shoutouts_on_user_id                                   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :celebrate_shoutout do
    user
    time_period
    rich_text { Faker::Lorem.sentences }
  end
end
