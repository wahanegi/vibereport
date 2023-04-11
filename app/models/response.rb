# == Schema Information
#
# Table name: responses
#
#  id             :bigint           not null, primary key
#  comment        :text
#  gif_url        :string
#  not_working    :boolean          default(FALSE)
#  notices        :jsonb
#  rating         :integer
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
class Response < ApplicationRecord
  belongs_to :time_period
  belongs_to :emotion, optional: true
  belongs_to :user

  validates :user_id, uniqueness: { scope: :time_period_id }
  validates :steps, presence: true
  serialize :steps, JSON
end
