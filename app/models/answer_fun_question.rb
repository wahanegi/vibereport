# == Schema Information
#
# Table name: answer_fun_questions
#
#  id              :bigint           not null, primary key
#  answer_body     :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  fun_question_id :bigint           not null
#  response_id     :bigint           not null
#  user_id         :bigint           not null
#
# Indexes
#
#  index_answer_fun_questions_on_fun_question_id  (fun_question_id)
#  index_answer_fun_questions_on_response_id      (response_id)
#  index_answer_fun_questions_on_user_id          (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (fun_question_id => fun_questions.id)
#  fk_rails_...  (response_id => responses.id)
#  fk_rails_...  (user_id => users.id)
#
class AnswerFunQuestion < ApplicationRecord
  belongs_to :response
  belongs_to :user
  belongs_to :fun_question
end
