require 'rails_helper'

NUMBER_OF_ELEMENTS = Emotion::SHOW_NUMBER_PER_CATEGORY

RSpec.describe Api::V1::ResponsesController do
  let!(:emotion) {create(:emotion, :category => "positive")}
  let!(:emotion_neutral) do
    NUMBER_OF_ELEMENTS.times { create(:emotion , :category => "neutral")}
  end
  let!(:emotion_negative) do
    18.times{ create(:emotion, :category => "negative") }
  end
  describe '#index' do
    it 'should returns a success response' do
      get '/api/v1/responses'
      expect(response).to have_http_status(:ok)
    end
    it 'should returns a proper format of the JSON response' do
      get '/api/v1/responses'
      expect(json.length).to eq(1)
      expected = json_data.first
      aggregate_failures do
        expect(expected[:id]).to eq(emotion.id.to_s)
        expect(expected[:type]).to eq('emotion')
        expect(expected[:attributes][:word]).to eq( emotion.word )
        expect(expected[:attributes][:category]).to eq( emotion.category )
        end
    end
    it 'should will be correct the length of the response' do
      get '/api/v1/responses'
      expect(json_data.length).to eq(25)
    end
    it 'should will be correct the length of a nested arrays' do
      get '/api/v1/responses'
      expect(json_data.first[:attributes].length).to eq(2)
      expect(json_data.count[:attributes][:category].positive)
    end
  end
end