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
    user
    time_period
    rich_text { Faker::Emotion.unique.adjective }
    recipients { [build(:user)] }
    after(:build) do |shoutout|
      row_sum = 0
      [shoutout.user_id, shoutout.time_period_id, shoutout.rich_text, shoutout.recipients].each do |field|
        digest = Digest::SHA1.hexdigest(field.to_s)
        row_sum += digest.to_i(16)
      end
      shoutout.digest = row_sum.to_s.slice(0, 16).to_i
    end
  end
end
