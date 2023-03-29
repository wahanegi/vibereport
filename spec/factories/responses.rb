# == Schema Information
#
# Table name: responses
#
#  id             :bigint           not null, primary key
#  gif_url        :string
#  not_working    :boolean          default(FALSE)
#  notices        :jsonb
#  steps          :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  emotion_id     :bigint
#  time_period_id :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_responses_on_emotion_id                  (emotion_id)
#  index_responses_on_time_period_id              (time_period_id)
#  index_responses_on_user_id                     (user_id)
#  index_responses_on_user_id_and_time_period_id  (user_id,time_period_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :response do
    association :user, factory: :user
    association :time_period, factory: :time_period
    association :emotion, factory: :emotion
  end

  trait :not_working_response do
    not_working { true }
  end
end
