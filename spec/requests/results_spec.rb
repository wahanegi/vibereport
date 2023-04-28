require 'rails_helper'
require 'passwordless/test_helpers'

RSpec.describe Api::V1::ResultsController do
  let!(:user) { create :user }
  let!(:time_period) { create :time_period }
  let!(:emotion) { create :emotion }
  let!(:fun_question) { create :fun_question, time_period: }
  let!(:answer_fun_question) { create :answer_fun_question, fun_question: }
  let!(:user_response) { create :response, emotion:, time_period:, user:, fun_question:, steps: %w[emotion-selection-web meme-selection] }

  before(:each) do
    passwordless_sign_in(user)
  end

  describe 'GET #show' do
    subject { get "/api/v1/results/#{time_period.id}" }

    it 'returns a success response' do
      subject
      expect(response).to have_http_status(:success)
    end

    it 'renders a JSON response with the results data' do
      subject
      debugger
      expect([response.parsed_body]).to eq [
        {
          # 'answers' => fun_question.answer_fun_questions,
          # 'emotions' => time_period.emotions,
          # 'fun_question' => fun_question,
          # 'gif_urls' => [user_response.gif_url],
          'time_periods' => TimePeriod.ordered.to_h
        }
      ]
    end
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      subject { post '/api/v1/fun_questions', params: valid_attributes }
      it 'creates a new fun question' do
        expect { subject }.to change(FunQuestion, :count).by(1)
      end

      it 'renders a JSON response with the new fun question' do
        subject
        fun_question = FunQuestion.last
        expect([response.parsed_body]).to eq [{ 'data' => {
          'id' => fun_question.id.to_s,
          'type' => 'fun_question',
          'attributes' =>
            {
              'id' => fun_question.id,
              'question_body' => fun_question.question_body
            }
        } }]
      end
    end
  end
end
