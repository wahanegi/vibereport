# == Schema Information
#
# Table name: responses
#
#  id                 :bigint           not null, primary key
#  bad_follow_comment :text
#  comment            :text
#  gif_url            :string
#  not_working        :boolean          default(FALSE)
#  notices            :jsonb
#  productivity       :integer
#  rating             :integer
#  steps              :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  emotion_id         :bigint
#  time_period_id     :bigint           not null
#  user_id            :bigint           not null
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
#  fk_rails_...  (emotion_id => emotions.id)
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
class Response < ApplicationRecord
  belongs_to :time_period
  belongs_to :emotion, optional: true
  belongs_to :user
  has_many :fun_questions, dependent: :destroy
  has_many :answer_fun_questions, dependent: :destroy

  validates :user_id, uniqueness: { scope: :time_period_id }
  validates :steps, presence: true
  validates :productivity, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 9 }, presence: true, if: -> { steps.present? && steps.include?('productivity-bad-follow-up') }
  serialize :steps, JSON  
end
