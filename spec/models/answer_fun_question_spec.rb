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
