require 'rails_helper'
require 'passwordless/test_helpers'

RSpec.describe Api::V1::ResponsesController do
  FactoryBot.create(:time_period, start_date: Date.current, end_date: Date.current + 6.days)
  let!(:user) { create :user }
  let!(:emotion) { create :emotion }
  let!(:new_emotion) { create :emotion }
  let!(:time_period) { create :time_period }
  let!(:user_response) { create :response, emotion:, time_period:, user:, steps: %w[emotion-selection-web meme-selection] }
  let!(:response_attr) { attributes_for :response, emotion_id: emotion.id, time_period_id: time_period.id, user_id: user.id, steps: %w[emotion-selection-web meme-selection] }

  before(:each) do |test|
    passwordless_sign_in(user) unless test.metadata[:logged_out]
  end

  describe '#create' do
    subject { post '/api/v1/responses', params: { response: { attributes: { emotion_id: emotion.id, time_period_id: time_period.id, user_id: user.id, steps: %w[emotion-selection-web meme-selection] } }, format: :json } }
    it 'responds to json formats when provided in the params' do
      subject
      expect(response.media_type).to eq 'application/json'
    end

    it 'create response' do
      Response.destroy_all
      subject
      response_saved = Response.find_by(emotion_id: emotion.id, time_period_id: time_period.id, user_id: user.id)
      expect([JSON.parse(response.body)]).to eq [{
        'emotion' =>
          {
            'id' => user_response.emotion.id,
            'category' => user_response.emotion.category,
            'created_at' => user_response.emotion.created_at.strftime('%FT%T.%LZ'),
            'updated_at' => user_response.emotion.updated_at.strftime('%FT%T.%LZ'),
            'word' => user_response.emotion.word,
            'public' => user_response.emotion.public
          },
        'user_shoutouts' => [],
        'data' => {
          'id' => response_saved.id.to_s,
          'type' => 'response',
          'attributes' =>
            {
              'id' => response_saved.id,
              'time_period_id' => response_saved.time_period_id,
              'emotion_id' => response_saved.emotion_id,
              'steps' => response_saved.steps,
              'gif' => nil,
              'rating' => user_response.rating,
              'comment' => user_response.comment,
              'productivity' => user_response.productivity,
              'bad_follow_comment' => user_response.bad_follow_comment,
              'fun_question_id' => nil,
              'fun_question_answer_id' => nil,
              'shoutout_id' => nil,
              'draft' => user_response.draft,
              'completed_at' => nil
            }
        },
        'current_user' => {
          'id' => user.id,
          'email' => user.email,
          'first_name' => user.first_name,
          'last_name' => user.last_name,
          'not_ask_visibility' => user.not_ask_visibility,
          'opt_out' => user.opt_out,
          'created_at' => user.created_at.strftime('%FT%T.%LZ'),
          'updated_at' => user.updated_at.strftime('%FT%T.%LZ')
        }
      }]
    end
  end

  describe '#update' do
    subject { put "/api/v1/responses/#{user_response.id}", params: { response: { attributes: { emotion_id: new_emotion.id, steps: %w[emotion-selection-web meme-selection] } }, format: :json } }

    it 'update response' do
      subject
      emotion = Emotion.find(new_emotion.id)
      expect([JSON.parse(response.body)]).to eq [{
        'emotion' =>
          {
            'id' => emotion.id,
            'category' => emotion.category,
            'created_at' => emotion.created_at.strftime('%FT%T.%LZ'),
            'updated_at' => emotion.updated_at.strftime('%FT%T.%LZ'),
            'word' => emotion.word,
            'public' => user_response.emotion.public
          },
        'user_shoutouts' => [],
        'data' =>
          {
            'id' => user_response.id.to_s,
            'type' => 'response',
            'attributes' =>
              {
                'id' => user_response.id,
                'time_period_id' => user_response.time_period_id,
                'emotion_id' => new_emotion.id,
                'steps' => %w[emotion-selection-web meme-selection],
                'gif' => nil,
                'rating' => user_response.rating,
                'comment' => user_response.comment,
                'productivity' => user_response.productivity,
                'bad_follow_comment' => user_response.bad_follow_comment,
                'shoutout_id' => nil,
                'fun_question_id' => user_response.fun_question.id,
                'fun_question_answer_id' => nil,
                'draft' => user_response.draft,
                'completed_at' => nil
              }
          },
        'current_user' => {
          'id' => user.id,
          'email' => user.email,
          'first_name' => user.first_name,
          'last_name' => user.last_name,
          'not_ask_visibility' => user.not_ask_visibility,
          'opt_out' => user.opt_out,
          'created_at' => user.created_at.strftime('%FT%T.%LZ'),
          'updated_at' => user.updated_at.strftime('%FT%T.%LZ')
        }
      }]
    end
  end
end
