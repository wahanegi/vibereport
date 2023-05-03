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
  let(:time_period) { create :time_period }
  let(:fun_question) { create :fun_question, time_period: }

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
    it { should validate_presence_of(:question_body) }
    it 'valid when time period is absent' do
      fun_question = FactoryBot.build(:fun_question, time_period_id: nil)
      expect(fun_question).to be_valid
    end
    it 'fail when time period is not uniq' do
      new_fun_question = FactoryBot.build(:fun_question, time_period_id: fun_question.time_period.id)
      expect(new_fun_question).to_not be_valid
    end
    it 'is invalid when question_body is not unique' do
      fun_question.save
      expect(build(:fun_question, question_body: fun_question.question_body)).to_not be_valid
    end
  end

  describe 'scopes' do
    describe '.question_public' do
      let!(:public_fun_question) { create(:fun_question, public: true, used: false) }
      let!(:private_fun_question) { create(:fun_question, public: false, used: false) }
      let!(:used_fun_question) { create(:fun_question, public: true, used: true) }

      it 'returns public and unused questions' do
        expect(FunQuestion.question_public).to eq([public_fun_question])
      end
    end
  end
end
