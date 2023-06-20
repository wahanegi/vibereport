require 'rails_helper'
require 'passwordless/test_helpers'

RSpec.describe Api::V1::EmotionsController do
  let!(:time_period) { create :time_period }
  let!(:fun_question) { create :fun_question }
  let!(:user) { create :user }
  let!(:emotion_positive) { create(:emotion, category: 'positive',  public: true) }
  let!(:emotion_negative) { create(:emotion, category: 'negative', public: true) }

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
      expect(json.length).to eq(9)
      expect(json[:time_period][:id]).to eq(TimePeriod.current.id)
      expect(json[:time_period][:start_date]).to eq(TimePeriod.current.start_date.to_s)
      expect(json[:time_period][:end_date]).to eq(TimePeriod.current.end_date.to_s)
      expected = json_data.first
      aggregate_failures do
        expect(expected[:id]).not_to eq(emotion.id.to_s)
        expect(expected[:type]).to eq('emotion')
      end
    end

    it 'should will be correct the length of the response' do
      get '/api/v1/emotions'
      puts JSON.pretty_generate(json_data)
      expect(json_data.length).to eq(12)
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
