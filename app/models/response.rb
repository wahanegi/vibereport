# == Schema Information
#
# Table name: responses
#
#  id             :bigint           not null, primary key
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  emotion_id     :bigint           not null
#  time_period_id :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_responses_on_emotion_id      (emotion_id)
#  index_responses_on_time_period_id  (time_period_id)
#  index_responses_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (emotion_id => emotions.id)
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
class Response < ApplicationRecord
  belongs_to :time_period
  belongs_to :emotion
  belongs_to :user

  validates :time_period, :emotion, :user, presence: true
  validates :user_id, uniqueness: {scope: :time_period_id}

end
