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
require 'rails_helper'

RSpec.describe FunQuestion, type: :model do
  describe 'associations' do
    it { should belong_to(:user).optional }
    it { should belong_to(:time_period).optional }
    it { should have_one(:response).dependent(:nullify) }
    it { should have_many(:fun_question_answers).dependent(:destroy) }
  end

  describe 'factory' do
    it 'should be valid' do
      fun_question = FactoryBot.build(:fun_question)
      expect(fun_question).to be_valid
    end
  end

  describe 'question_public scope' do
    let!(:public_unused_question) { create(:fun_question, public: true, used: false) }
    let!(:public_used_question) { create(:fun_question, public: true, used: true) }
    let!(:private_unused_question) { create(:fun_question, public: false, used: false) }

    it 'returns only public and unused questions' do
      expect(FunQuestion.question_public.not_used).to eq([public_unused_question])
    end
  end

  describe 'validations' do
    let(:fun_question) { build(:fun_question) }
    it { should validate_presence_of(:question_body) }
    it 'is invalid when question_body is not unique' do
      fun_question.save
      expect(build(:fun_question, question_body: fun_question.question_body)).to_not be_valid
    end
  end
end