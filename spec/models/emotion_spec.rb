# == Schema Information
#
# Table name: emotions
#
#  id         :bigint           not null, primary key
#  category   :integer          default("neutral")
#  public     :boolean          default(FALSE)
#  word       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe Emotion, type: :model do
  let!(:emotion) { create :emotion }
  let!(:emotion_positive) { create(:emotion, category: 'positive') }
  let!(:emotion_neutral) { create(:emotion, category: 'neutral') }
  let!(:emotion_negative) { create(:emotion, category: 'negative') }
  before do
    Faker::UniqueGenerator.clear
  end
  context 'Factories' do
    it { expect(emotion).to be_valid }
  end

  context 'associations' do
    it 'has many responses' do
      expect(emotion).to have_many(:responses).dependent(:destroy)
    end
  end

  describe 'Scopes' do
    it 'positive scope' do
      expect(Emotion.emotion_public.positive).to include(emotion_positive)
    end
    it 'neutral scope' do
      expect(Emotion.emotion_public.neutral).to include(emotion_neutral)
    end
    it 'negative scope' do
      expect(Emotion.emotion_public.negative).to include(emotion_negative)
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

    it 'the capitalized emotion word should not be used' do
      new_word = FactoryBot.build(:emotion, word: emotion.word.upcase!)
      expect(new_word).to_not be_valid
    end
  end

  describe 'Before actions' do
    it 'during creates and saves it downcases the emotion.word' do
      feeling = create(:emotion, word: 'SO SO')
      expect(feeling.reload.word).to eq('so so')
      emotion.update(word: 'Enthusiastic')
      expect(emotion.reload.word).to eq('enthusiastic')
    end
  end

  describe '#create' do
    it 'creates a new Emotion' do
      expect { Emotion.create(word: 'well', category: "positive", public: false) }.to change(Emotion, :count).by(1)
    end

    context 'with existing emotion word' do
      let!(:existing_emotion) { create(:emotion, word: 'happy', category: 'positive', public: false) }
      let(:emotion_params) { { emotion: { word: 'happy', category: 'positive', public: false } } }

      it 'does not create a new Emotion' do
        expect { Emotion.create(word: 'happy', category: 'positive', public: false) }.not_to change(Emotion, :count)
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new Emotion' do
        expect { Emotion.create(word: '', category: 'positive', public: false) }.not_to change(Emotion, :count)
      end
    end
  end
end

