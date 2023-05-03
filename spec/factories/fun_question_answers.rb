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
FactoryBot.define do
  factory :fun_question_answer do
    answer_body { Faker::Lorem.sentences.first }
    association :user, factory: :user
    association :fun_question, factory: :fun_question
  end
end
