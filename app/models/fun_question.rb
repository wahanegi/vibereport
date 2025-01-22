# == Schema Information
#
# Table name: fun_questions
#
#  id             :bigint           not null, primary key
#  public         :boolean          default(FALSE), not null
#  question_body  :string
#  used           :boolean          default(FALSE), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  time_period_id :bigint
#  user_id        :bigint
#
# Indexes
#
#  index_fun_questions_on_question_body   (question_body) UNIQUE
#  index_fun_questions_on_time_period_id  (time_period_id)
#  index_fun_questions_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
class FunQuestion < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :time_period, optional: true
  has_one :response, dependent: :nullify
  has_many :fun_question_answers, dependent: :destroy

  scope :question_public, -> { where(public: true) }
  scope :not_used, -> { where(used: false) }

  validates :question_body, presence: true, uniqueness: { case_sensitive: false }
  validates :time_period, uniqueness: true, unless: -> { time_period.nil? }

  def self.ransackable_attributes(_auth_object = nil)
    %w[created_at id id_value public question_body time_period_id updated_at used user_id]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[created_at id id_value public question_body time_period_id updated_at used user_id]
  end
end
