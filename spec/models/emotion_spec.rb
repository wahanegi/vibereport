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
  let!(:emotion_positive) { create(:emotion, :category => "positive") }
  let!(:emotion_neutral) { create(:emotion,  :category => "neutral") }
  let!(:emotion_negative) { create(:emotion, :category => "negative") }
  before do
    Faker::UniqueGenerator.clear
  end
  context 'Factories' do
    it { expect(emotion).to be_valid }
  end

  describe 'Scopes' do
    it "positive scope" do
      expect(Emotion.positive).to include(emotion_positive)
    end
    it "neutral scope" do
      expect(Emotion.neutral).to include(emotion_neutral)
    end
    it "negative scope" do
      expect(Emotion.negative).to include(emotion_negative)
    end
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

    it "the capitalized emotion word should not be used" do
      new_word = FactoryBot.build(:emotion, word: emotion.word.upcase!)
      expect(new_word).to_not be_valid
    end
  end

  describe 'Before actions' do
    it 'during creates and saves it downcases the emotion.word' do
      feeling = create(:emotion, word: 'HAPPY')
      expect(feeling.reload.word).to eq('happy')
      emotion.update(word: 'Enthusiastic')
      expect(emotion.reload.word).to eq('enthusiastic')
    end
  end
end
