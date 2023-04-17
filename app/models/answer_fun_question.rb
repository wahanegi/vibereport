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
class AnswerFunQuestion < ApplicationRecord
  belongs_to :response
  belongs_to :user
  belongs_to :fun_question
end
