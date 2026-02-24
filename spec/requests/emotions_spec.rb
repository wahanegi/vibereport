require 'rails_helper'

RSpec.describe Api::V1::EmotionsController do
  let!(:time_period) { create :time_period }
  let!(:fun_question) { create :fun_question }
  let!(:user) { create :user }
  let!(:emotion) { create(:emotion, category: 'positive', public: true) }
  let!(:emotion_positive) do
    12.times { create(:emotion, category: 'positive', public: true) }
  end
  let!(:emotion_negative) do
    12.times { create(:emotion, category: 'negative', public: true) }
  end

  before(:each) do
    sign_in(user)
  end

  describe '#index' do
    it 'should returns a success response' do
      get '/api/v1/emotions'
      expect(response).to have_http_status(:success)
    end

    it 'returns JSON with required keys and time_period' do
      get '/api/v1/emotions'
      expect(json).to have_key(:innovation_topic)
      expect(json).to have_key(:time_period)
      expect(json[:time_period][:id]).to eq(TimePeriod.current.id)
      expect(json[:time_period][:start_date]).to eq(TimePeriod.current.start_date.to_s)
      expect(json[:time_period][:end_date]).to eq(TimePeriod.current.end_date.to_s)
      expected = json_data.first
      expect(expected[:id]).not_to eq(emotion.id.to_s)
      expect(expected[:type]).to eq('emotion')
    end

    it 'returns emotions data as an array with both categories' do
      get '/api/v1/emotions'
      expect(json_data).to be_an(Array)
      expect(json_data).not_to be_empty
      expect(json_data.first[:attributes]).to include(:word, :category)
    end

    context 'innovation_topic' do
      it 'includes innovation_topic when an unposted topic exists and marks it as posted' do
        topic = create(:innovation_topic, posted: false, time_period_id: nil, user: user)
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic]).to be_present
        expect(json[:innovation_topic][:id]).to eq(topic.id)
        expect(json[:innovation_topic][:innovation_body]).to eq(topic.innovation_body)
        expect(json[:innovation_topic][:time_period_id]).to eq(TimePeriod.find_or_create_time_period.id)
        expect(topic.reload.posted).to eq(true)
        expect(topic.reload.time_period_id).to eq(TimePeriod.find_or_create_time_period.id)
      end

      it 'returns nil when no topic for current period and no unposted topics exist' do
        create(:innovation_topic, posted: true, time_period_id: nil, user: user)
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic]).to be_nil
      end

      it 'returns the same innovation_topic on subsequent requests when already assigned to period' do
        topic = create(:innovation_topic, posted: false, time_period_id: nil, user: user)
        get '/api/v1/emotions'
        first_id = json[:innovation_topic][:id]
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic][:id]).to eq(first_id)
        expect(json[:innovation_topic][:id]).to eq(topic.id)
      end
    end
  end
end
