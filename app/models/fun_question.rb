# == Schema Information
#
# Table name: fun_questions
#
#  id             :bigint           not null, primary key
#  public         :boolean          default(FALSE), not null
#  question_body  :text
#  used           :boolean          default(FALSE), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  time_period_id :bigint
#  user_id        :bigint
#
# Indexes
#
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
  has_many :answer_fun_questions, dependent: :destroy
  scope :question_public, -> { where(public: true).where(used: false) }
end
