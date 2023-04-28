# == Schema Information
#
# Table name: responses
#
#  id                     :bigint           not null, primary key
#  bad_follow_comment     :text
#  celebrate_comment      :text
#  comment                :text
#  gif_url                :string
#  not_working            :boolean          default(FALSE)
#  notices                :jsonb
#  productivity           :integer
#  rating                 :integer
#  steps                  :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  answer_fun_question_id :bigint
#  emotion_id             :bigint
#  fun_question_id        :bigint
#  time_period_id         :bigint           not null
#  user_id                :bigint           not null
#
# Indexes
#
#  index_responses_on_answer_fun_question_id      (answer_fun_question_id)
#  index_responses_on_emotion_id                  (emotion_id)
#  index_responses_on_fun_question_id             (fun_question_id)
#  index_responses_on_time_period_id              (time_period_id)
#  index_responses_on_user_id                     (user_id)
#  index_responses_on_user_id_and_time_period_id  (user_id,time_period_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (answer_fun_question_id => answer_fun_questions.id)
#  fk_rails_...  (emotion_id => emotions.id)
#  fk_rails_...  (fun_question_id => fun_questions.id)
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
class Response < ApplicationRecord
  belongs_to :time_period
  belongs_to :emotion, optional: true
  belongs_to :user
  belongs_to :fun_question, optional: true
  belongs_to :answer_fun_question, optional: true

  validates :user_id, uniqueness: { scope: :time_period_id }
  validates :steps, presence: true
  validates :productivity, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 9 },
                           presence: true, if: -> { steps.present? && steps.include?('productivity-bad-follow-up') }
  serialize :steps, JSON
  scope :working, -> { where(not_working: false) }
end
