# == Schema Information
#
# Table name: responses
#
#  id                          :bigint           not null, primary key
#  celebrate_comment           :string
#  comment                     :text
#  completed_at                :date
#  draft                       :boolean          default(FALSE), not null
#  gif                         :jsonb
#  not_working                 :boolean          default(FALSE)
#  notices                     :jsonb
#  productivity                :integer
#  productivity_comment        :text
#  rating                      :integer
#  steps                       :string
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  emotion_id                  :bigint
#  fun_question_answer_id      :bigint
#  fun_question_id             :bigint
#  innovation_brainstorming_id :bigint
#  innovation_topic_id         :bigint
#  shoutout_id                 :bigint
#  time_period_id              :bigint           not null
#  user_id                     :bigint           not null
#
# Indexes
#
#  index_responses_on_emotion_id                   (emotion_id)
#  index_responses_on_fun_question_answer_id       (fun_question_answer_id)
#  index_responses_on_fun_question_id              (fun_question_id)
#  index_responses_on_innovation_brainstorming_id  (innovation_brainstorming_id)
#  index_responses_on_innovation_topic_id          (innovation_topic_id)
#  index_responses_on_shoutout_id                  (shoutout_id)
#  index_responses_on_time_period_id               (time_period_id)
#  index_responses_on_user_id                      (user_id)
#  index_responses_on_user_id_and_time_period_id   (user_id,time_period_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (emotion_id => emotions.id)
#  fk_rails_...  (fun_question_answer_id => fun_question_answers.id)
#  fk_rails_...  (fun_question_id => fun_questions.id)
#  fk_rails_...  (innovation_brainstorming_id => innovation_brainstormings.id)
#  fk_rails_...  (innovation_topic_id => innovation_topics.id)
#  fk_rails_...  (shoutout_id => shoutouts.id)
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
class Response < ApplicationRecord
  belongs_to :time_period
  belongs_to :emotion, optional: true
  belongs_to :user
  belongs_to :fun_question, optional: true
  belongs_to :fun_question_answer, optional: true
  belongs_to :innovation_topic, optional: true
  belongs_to :innovation_brainstorming, optional: true

  validates :user_id, uniqueness: { scope: :time_period_id }
  validates :steps, presence: true
  validates :productivity, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 9 },
                           presence: true, if: -> { steps.present? && steps.include?('productivity-bad-follow-up') }
  serialize :steps, coder: JSON

  scope :working, -> { where(not_working: false) }
  scope :completed, -> { where.not(completed_at: nil) }
  scope :celebrated, -> { where.not(celebrate_comment: [nil, '']) }
  scope :unique_responses, -> { select('DISTINCT ON ("gif"->>\'src\', "emotion_id") *') }

  def celebrate_user_ids
    Response.celebrate_user_ids_from_comment(celebrate_comment)
  end

  def self.celebrate_user_ids_from_comment(comment)
    comment.scan(/@\[.*?\]\((\d+)\)/).flatten.map(&:to_i)
  end

  def received_celebrate_comments
    Response.celebrated
            .where("? = ANY(STRING_TO_ARRAY(celebrate_comment, ' '))", user_id)
            .where(user_id: celebrate_user_ids)
  end

  def self.ransackable_attributes(_auth_object = nil)
    %w[celebrate_comment comment completed_at created_at draft
       emotion_id fun_question_answer_id fun_question_id gif id id_value
       not_working notices productivity productivity_comment rating
       shoutout_id steps time_period_id updated_at user_id]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[emotion fun_question fun_question_answer time_period user innovation_topic innovation_brainstorming]
  end
end
