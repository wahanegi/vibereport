# == Schema Information
#
# Table name: fun_questions
#
#  id            :bigint           not null, primary key
#  question_body :text
#  used          :boolean          default(FALSE), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  response_id   :bigint
#  user_id       :bigint
#
# Indexes
#
#  index_fun_questions_on_response_id  (response_id)
#  index_fun_questions_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (response_id => responses.id)
#  fk_rails_...  (user_id => users.id)
#
class FunQuestion < ApplicationRecord
  belongs_to :response, optional: true
  belongs_to :user, optional: true
  has_many :answer_fun_questions, dependent: :destroy
end
