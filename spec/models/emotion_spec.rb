# == Schema Information
#
# Table name: emotions
#
#  id         :bigint           not null, primary key
#  category   :integer          default("neutral")
#  word       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe Emotion, type: :model do
  let!(:emotion) { create :emotion }

  context 'Factories' do
    it { expect(emotion).to be_valid }
  end

  describe 'Relationships' do
  end

  describe 'Validations' do
    it { is_expected.to validate_presence_of :word }
    it { is_expected.to validate_length_of(:word).is_at_least(2).is_at_most(15) }
    it { is_expected.to define_enum_for(:category).with_values(negative: 0, neutral: 1, positive: 2) }

    it 'the same emotion word should not be used' do
      new_word = FactoryBot.build(:emotion, word: emotion.word)
      expect(new_word).to_not be_valid
   end
  end
end
