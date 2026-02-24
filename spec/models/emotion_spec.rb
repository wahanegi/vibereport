# == Schema Information
#
# Table name: emotions
#
#  id         :bigint           not null, primary key
#  category   :integer          default("positive")
#  public     :boolean          default(FALSE)
#  word       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe Emotion, type: :model do
  let!(:emotion) { create :emotion }
  let!(:emotion_positive) { create(:emotion, category: 'positive') }
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
    it 'negative scope' do
      expect(Emotion.emotion_public.negative).to include(emotion_negative)
    end
  end

  describe 'Validations' do
    it { is_expected.to validate_presence_of :word }
    it { is_expected.to validate_length_of(:word).is_at_least(2).is_at_most(15) }

    context 'uniqueness of word within category' do
      let!(:existing_emotion) { create(:emotion, word: 'pressured', category: :positive) }

      it 'does not allow the same emotion word with the same category' do
        new_emotion = FactoryBot.build(:emotion, word: existing_emotion.word, category: existing_emotion.category)
        expect(new_emotion).to_not be_valid
      end

      it 'allows the same emotion word with a different category' do
        new_emotion = FactoryBot.build(:emotion, word: existing_emotion.word, category: :negative)
        expect(new_emotion).to be_valid
      end

      it 'the capitalized emotion word should not be used' do
        uppercase_word = existing_emotion.word.upcase!
        new_word = FactoryBot.build(:emotion, word: uppercase_word, category: existing_emotion.category)
        expect(new_word).to_not be_valid
      end
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
      expect { Emotion.create(word: 'well', category: 'positive', public: false) }.to change(Emotion, :count).by(1)
    end

    context 'with existing emotion word' do
      # Используем уникальное слово, чтобы не пересекаться с let! на уровне describe (Faker может создать 'happy' + positive)
      let!(:existing_emotion) { create(:emotion, word: 'existingword', category: 'positive', public: false) }

      it 'creates with existing emotion word and new category' do
        expect { Emotion.create(word: 'existingword', category: 'negative', public: false) }.to change(Emotion, :count)
      end

      it 'does not create with existing emotion word and category' do
        expect { Emotion.create(word: 'existingword', category: 'positive', public: false) }.not_to change(Emotion, :count)
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new Emotion' do
        expect { Emotion.create(word: '', category: 'positive', public: false) }.not_to change(Emotion, :count)
      end
    end
  end

  describe 'Scopes' do
    let!(:emotion1) { create(:emotion, word: 'happy', category: 'positive') }
    let!(:emotion2) { create(:emotion, word: 'sad', category: 'negative') }

    it 'returns emotions with matching word and category' do
      emotions = Emotion.matching_emotions(word: 'happy', category: 'positive')
      expect(emotions).to include(emotion1)
      expect(emotions).not_to include(emotion2)
    end

    it 'returns empty array if no matching emotions found' do
      emotions = Emotion.matching_emotions(word: 'angry', category: 'negative')
      expect(emotions).to be_empty
    end
  end
end
