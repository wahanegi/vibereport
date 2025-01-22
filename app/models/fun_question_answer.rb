# == Schema Information
#
# Table name: fun_question_answers
#
#  id              :bigint           not null, primary key
#  answer_body     :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  fun_question_id :bigint           not null
#  user_id         :bigint           not null
#
# Indexes
#
#  index_fun_question_answers_on_fun_question_id  (fun_question_id)
#  index_fun_question_answers_on_user_id          (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (fun_question_id => fun_questions.id)
#  fk_rails_...  (user_id => users.id)
#
class FunQuestionAnswer < ApplicationRecord
  has_one :response, dependent: :nullify
  belongs_to :user
  belongs_to :fun_question
  has_many :emojis, as: :emojiable, dependent: :destroy

  validates :answer_body, presence: true

  def self.alert_needed?
    unused_questions_count = where(used: false).count
    unused_questions_count.zero?
  end

  def self.ransackable_attributes(_auth_object = nil)
    %w[answer_body fun_question_id id user_id]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[answer_body fun_question_id id user_id]
  end
end
