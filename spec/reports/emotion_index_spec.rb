require 'rails_helper'

RSpec.describe EmotionIndex, type: :model do
  describe '#generate' do
    let(:team) { create(:team) }
    let(:time_periods) { [create(:time_period)] }

    subject { described_class.new(team, time_periods).generate }

    context 'when there are no responses' do
      it 'returns a string indicating no emotion index present' do
        expect(subject).to eq({ emotion_index: 'No emotion index present.', chart: nil })
      end
    end

    context 'when there are responses' do
      let!(:positive_response_1) { create(:response, user: create(:user, teams: [team]), time_period: time_periods.first, emotion: create(:emotion, category: 'positive'), rating: 5) }
      let!(:positive_response_2) { create(:response, user: create(:user, teams: [team]), time_period: time_periods.first, emotion: create(:emotion, category: 'positive'), rating: 3) }
      let!(:negative_response) { create(:response, user: create(:user, teams: [team]), time_period: time_periods.first, emotion: create(:emotion, category: 'negative'), rating: 2) }

      it 'returns a hash with emotion index and a chart' do
        result = subject
        expect(result[:emotion_index]).to be_a(Float)
        expect(result[:chart]).to include('<div id="')
        expect(result[:chart]).to include('</div>')
      end

      it 'calculates correct emotion index' do
        result = subject
        expected_emotion_index = ((positive_response_1.rating + positive_response_2.rating - negative_response.rating) / 3.0).round(2)
      
        expect(result[:emotion_index]).to eq(expected_emotion_index)
      end
    end

    context 'when there are only positive responses' do
      let!(:positive_response_1) { create(:response, user: create(:user, teams: [team]), time_period: time_periods.first, emotion: create(:emotion, category: 'positive'), rating: 5) }
      let!(:positive_response_2) { create(:response, user: create(:user, teams: [team]), time_period: time_periods.first, emotion: create(:emotion, category: 'positive'), rating: 3) }

      it 'calculates correct emotion index' do
        result = subject
        expected_emotion_index = ((positive_response_1.rating + positive_response_2.rating) / 2.0).round(2)

        expect(result[:emotion_index]).to eq(expected_emotion_index)
      end
    end

    context 'when there are only negative responses' do
      let!(:negative_response_1) { create(:response, user: create(:user, teams: [team]), time_period: time_periods.first, emotion: create(:emotion, category: 'negative'), rating: 2) }
      let!(:negative_response_2) { create(:response, user: create(:user, teams: [team]), time_period: time_periods.first, emotion: create(:emotion, category: 'negative'), rating: 1) }

      it 'calculates correct emotion index' do
        result = subject
        expected_emotion_index = -((negative_response_1.rating + negative_response_2.rating) / 2.0).round(2)

        expect(result[:emotion_index]).to eq(expected_emotion_index)
      end
    end
  end
end
