require 'rails_helper'
require "passwordless/test_helpers"

RSpec.describe Api::V1::ResponsesController do
  FactoryBot.create(:time_period, start_date: Date.current, end_date: Date.current + 6.days)
  let!(:user) { create :user }
  let!(:emotion) { create :emotion }
  let!(:new_emotion) { create :emotion }
  let!(:time_period) { create :time_period }
  let!(:user_response) { create :response, emotion: emotion, time_period: time_period, user: user, steps: %w[emotion-selection-web meme-selection]}
  let!(:response_attr) { attributes_for :response, emotion_id: emotion.id, time_period_id: time_period.id, user_id: user.id, steps: %w[emotion-selection-web meme-selection] }

  before(:each) do |test|
    passwordless_sign_in(user) unless test.metadata[:logged_out]
  end

  describe '#index' do
    it 'should returns a success response' do
      get '/api/v1/responses'
      expect(response).to have_http_status(:success)
    end

    it 'has a 401 status code for non sigh_in user', :logged_out do
      get '/api/v1/responses'
      expect(response.status).to eq(302)
    end

    it 'should will be correct the length of the response' do
      get '/api/v1/responses'
      expect(Response.all.length).to eq(1)
    end
  end

  describe '#show' do
    it 'should returns a success response' do
      get "/api/v1/responses/#{user_response.id}"
      expect(response).to have_http_status(:success)
    end

    it 'has a 401 status code for non sigh_in user', :logged_out do
      get "/api/v1/responses/#{user_response.id}"
      expect(response.status).to eq(302)
    end

    it 'should will be correct response' do
      get "/api/v1/responses/#{user_response.id}"
      expect([JSON.parse(response.body)]).to eq [{
                                                   "emotion" =>
                                                     {
                                                       "id" => user_response.emotion.id,
                                                       "category" => user_response.emotion.category,
                                                       "created_at" => user_response.emotion.created_at.strftime('%FT%T.%LZ'),
                                                       "updated_at" => user_response.emotion.updated_at.strftime('%FT%T.%LZ'),
                                                       "word" => user_response.emotion.word
                                                     },
                                                   "data"=>{
                                                       "id" => user_response.id.to_s,
                                                       "type" => "response",
                                                       "attributes" =>
                                                         {
                                                           "id" => user_response.id,
                                                           "time_period_id" => user_response.time_period_id,
                                                           "emotion_id" => user_response.emotion_id,
                                                           "steps" => user_response.steps
                                                         }
                                                     }
                                                 }]
    end
  end

  describe '#create' do
    subject { post "/api/v1/responses", params: { response: { attributes: { emotion_id: emotion.id, time_period_id: time_period.id, user_id: user.id, steps: %w[emotion-selection-web meme-selection]  } }, format: :json } }
    it "responds to json formats when provided in the params" do
      subject
      expect(response.media_type).to eq "application/json"
    end

    it 'create response' do
      Response.destroy_all
      subject
      response_saved = Response.find_by(emotion_id: emotion.id, time_period_id: time_period.id, user_id: user.id)
      expect([JSON.parse(response.body)]).to eq [{
                                                   "emotion" =>
                                                     {
                                                       "id" => user_response.emotion.id,
                                                       "category" => user_response.emotion.category,
                                                       "created_at" => user_response.emotion.created_at.strftime('%FT%T.%LZ'),
                                                       "updated_at" => user_response.emotion.updated_at.strftime('%FT%T.%LZ'),
                                                       "word" => user_response.emotion.word
                                                     },
                                                   "data" => {
                                                       "id" => response_saved.id.to_s,
                                                       "type" => "response",
                                                       "attributes" =>
                                                         {
                                                           "id" => response_saved.id,
                                                           "time_period_id" => response_saved.time_period_id,
                                                           "emotion_id" => response_saved.emotion_id,
                                                           "steps" => response_saved.steps
                                                         }
                                                     }
                                                 }]
    end
  end

  describe '#update' do
    subject { put "/api/v1/responses/#{user_response.id}", params: { response: { attributes: { emotion_id: new_emotion.id, steps: ["emotion-selection-web", "meme-selection"] } }, format: :json } }

    it 'update response' do
      subject
      emotion = Emotion.find(new_emotion.id)
      expect([JSON.parse(response.body)]).to eq [{
                                                   "emotion" =>
                                                     {
                                                       "id" => emotion.id,
                                                       "category" => emotion.category,
                                                       "created_at" => emotion.created_at.strftime('%FT%T.%LZ'),
                                                       "updated_at" => emotion.updated_at.strftime('%FT%T.%LZ'),
                                                       "word" => emotion.word
                                                     },
                                                   "data"=>
                                                     {
                                                       "id" => user_response.id.to_s,
                                                       "type" => "response",
                                                       "attributes" =>
                                                         {
                                                           "id" => user_response.id,
                                                           "time_period_id" => user_response.time_period_id,
                                                           "emotion_id" => new_emotion.id,
                                                           "steps" => ["emotion-selection-web", "meme-selection"],
                                                         }
                                                     }
                                                 }]
    end
  end
end