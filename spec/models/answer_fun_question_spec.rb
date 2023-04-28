# == Schema Information
#
# Table name: answer_fun_questions
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
#  index_answer_fun_questions_on_fun_question_id  (fun_question_id)
#  index_answer_fun_questions_on_user_id          (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (fun_question_id => fun_questions.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe AnswerFunQuestion, type: :model do
  describe 'associations' do
    it { should belong_to :user }
    it { should have_one(:response).dependent(:nullify) }
    it { should belong_to :fun_question }
  end

  describe 'factory' do
    it 'should be valid' do
      answer_fun_question = FactoryBot.build(:answer_fun_question)
      expect(answer_fun_question).to be_valid
    end
  end

  describe 'validations' do
    it { should validate_presence_of(:answer_body) }
  end
end
