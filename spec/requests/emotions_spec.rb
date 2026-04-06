require 'rails_helper'

RSpec.describe Api::V1::EmotionsController do
  let!(:time_period) { create :time_period }
  let!(:fun_question) { create :fun_question }
  let!(:user) { create :user }
  let!(:emotion) { create(:emotion, category: 'positive', public: true) }
  let!(:emotion_positive) { create_list(:emotion, 12) }
  let!(:emotion_negative) { create_list(:emotion, 12, :negative) }

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
      expect(expected[:id]).to be_present
      expect(expected[:type]).to eq('emotion')
    end

    it 'returns emotions data as an array with both categories' do
      get '/api/v1/emotions'
      expect(json_data).to be_an(Array)
      expect(json_data).not_to be_empty
      expect(json_data.first[:attributes]).to include(:word, :category)
    end

    context 'innovation_topic' do
      it 'returns topic pre-assigned to current period and sets posted on first request' do
        current_period = TimePeriod.find_or_create_time_period
        topic = create(:innovation_topic, posted: false, time_period: current_period, user: user)
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic]).to be_present
        expect(json[:innovation_topic][:id]).to eq(topic.id)
        expect(json[:innovation_topic][:innovation_body]).to eq(topic.innovation_body)
        expect(json[:innovation_topic][:time_period_id]).to eq(current_period.id)
        expect(topic.reload.posted).to eq(true)
      end

      it 'returns same topic on second request without updating posted again' do
        current_period = TimePeriod.find_or_create_time_period
        topic = create(:innovation_topic, posted: true, time_period: current_period, user: user)
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic][:id]).to eq(topic.id)
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic][:id]).to eq(topic.id)
        expect(topic.reload.posted).to eq(true)
      end

      it 'returns nil when no topic assigned to current period' do
        create(:innovation_topic, posted: true, time_period_id: nil, user: user)
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic]).to be_nil
      end

      it 'includes innovation_topic when an unposed topic exists and marks it as posted' do
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

      it 'returns the same innovation_topic on subsequent requests when already assigned to period' do
        topic = create(:innovation_topic, posted: false, time_period_id: nil, user: user)
        get '/api/v1/emotions'
        first_id = json[:innovation_topic][:id]
        get '/api/v1/emotions'
        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic][:id]).to eq(first_id)
        expect(json[:innovation_topic][:id]).to eq(topic.id)
      end

      it 'assigns the eligible innovation topic with the lowest sort_order when several exist' do
        first_topic = create(
          :innovation_topic,
          posted: false,
          time_period_id: nil,
          user: user,
          innovation_body: 'FIFO deterministic topic alpha',
          sort_order: 10
        )
        second_topic = create(
          :innovation_topic,
          posted: false,
          time_period_id: nil,
          user: user,
          innovation_body: 'FIFO deterministic topic beta',
          sort_order: 20
        )

        get '/api/v1/emotions'

        expect(response).to have_http_status(:success)
        expect(json[:innovation_topic][:id]).to eq(first_topic.id)
        expect(InnovationTopic.find(first_topic.id).time_period_id).to eq(TimePeriod.find_or_create_time_period.id)
        expect(InnovationTopic.find(second_topic.id).time_period_id).to be_nil
      end
    end
  end
end
