require 'rails_helper'
require 'passwordless/test_helpers'

NUMBER_OF_ELEMENTS = Emotion::SHOW_NUMBER_PER_CATEGORY

RSpec.describe Api::V1::EmotionsController do
  FactoryBot.create(:time_period, start_date: Date.current, end_date: Date.current + 6.days)
  let!(:user) { create :user }
  let!(:emotion) { create(:emotion, category: 'positive', public: true) }
  let!(:emotion_neutral) do
    NUMBER_OF_ELEMENTS.times { create(:emotion, category: 'neutral', public: true) }
  end

  let!(:emotion_negative) do
    18.times { create(:emotion, category: 'negative', public: true) }
  end

  before(:each) do
    passwordless_sign_in(user)
  end

  describe '#index' do
    it 'should returns a success response' do
      get '/api/v1/emotions'
      expect(response).to have_http_status(:success)
    end

    it 'should returns a proper format of the JSON response' do
      get '/api/v1/emotions'
      expect(json.length).to eq(10)
      expect(json[:time_period][:id]).to eq(TimePeriod.current.id)
      expect(json[:time_period][:start_date]).to eq(TimePeriod.current.start_date.to_s)
      expect(json[:time_period][:end_date]).to eq(TimePeriod.current.end_date.to_s)
      expected = json_data.first
      aggregate_failures do
        expect(expected[:id]).to eq(emotion.id.to_s)
        expect(expected[:type]).to eq('emotion')
      end
    end

    it 'should will be correct the length of the response' do
      get '/api/v1/emotions'
      expect(json_data.length).to eq(25)
    end

    it 'should will be correct the length of a nested arrays' do
      get '/api/v1/emotions'
      expect(json_data.first[:attributes].length).to eq(2)
      expect(count_word_in_obj('positive', json)).to eq(1)
      expect(count_word_in_obj('neutral', json)).to eq(12)
      expect(count_word_in_obj('negative', json)).to eq(12)
    end
  end
end
