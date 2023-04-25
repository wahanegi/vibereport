require 'rails_helper'
require 'passwordless/test_helpers'

RSpec.describe Api::V1::FunQuestionsController do
  let!(:user) { create :user }
  let!(:time_period) { create :time_period }
  let!(:fun_question) { create :fun_question }
  let!(:valid_attributes) do
    {
      fun_question: {
        user_id: user.id,
        time_period_id: time_period.id,
        question_body: Faker::Lorem.questions(number: 1).first
      }
    }
  end

  let!(:invalid_attributes) do
    {
      fun_question: {
        user_id: user.id,
        time_period_id: time_period.id,
        question_body: ''
      }
    }
  end

  before(:each) do |test|
    passwordless_sign_in(user) unless test.metadata[:logged_out]
  end

  describe 'GET #show' do
    it 'returns a success response' do
      get "/api/v1/fun_questions/#{fun_question.id}"
      expect(response).to have_http_status(:success)
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

    context 'with invalid parameters' do
      subject { post '/api/v1/fun_questions', params: invalid_attributes }
      it 'does not create a new fun question' do
        expect { subject }.to_not change(FunQuestion, :count)
      end

      it 'renders a JSON response with errors for the new fun question' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to eq('application/json; charset=utf-8')
        expect(response.body).to match("{\"error\":{\"question_body\":[\"can't be blank\"]}}")
      end
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

    context 'with invalid parameters' do
      subject { post '/api/v1/fun_questions', params: invalid_attributes }
      it 'does not create a new fun question' do
        expect { subject }.to_not change(FunQuestion, :count)
      end

      it 'renders a JSON response with errors for the new fun question' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to eq('application/json; charset=utf-8')
        expect(response.body).to match("{\"error\":{\"question_body\":[\"can't be blank\"]}}")
      end
    end
  end

  describe 'PUT #update' do
    context 'with valid parameters' do
      subject { put "/api/v1/fun_questions/#{fun_question.id}", params: { id: fun_question.id, fun_question: { question_body: 'Updated question' } } }
      it 'updates the fun question' do
        subject
        expect(response).to have_http_status(:success)
        updated_question = FunQuestion.find_by(id: fun_question.id)
        expect(updated_question.question_body).to eq('Updated question')
      end

      it 'returns the updated fun question as JSON' do
        subject
        expect(response).to have_http_status(:success)
        response_question_body = response.parsed_body.dig('data', 'attributes', 'question_body')
        expect(response_question_body).to eq('Updated question')
      end
    end

    context 'with invalid parameters' do
      subject { put "/api/v1/fun_questions/#{fun_question.id}", params: { id: fun_question.id, fun_question: { question_body: '' } } }
      it 'returns an error message' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        response_body = response.parsed_body
        expect(response_body['error']['question_body']).to include("can't be blank")
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'when the fun question exists' do
      subject { delete "/api/v1/fun_questions/#{fun_question.id}", params: { id: fun_question.id } }
      it 'deletes the fun question' do
        expect { subject }.to change(FunQuestion, :count).by(-1)
      end

      it 'returns a 204 No Content status' do
        subject
        expect(response).to have_http_status(:no_content)
      end
    end

    context 'when the fun question does not exist' do
      it 'returns a Not Content status' do
        delete "/api/v1/fun_questions/#{fun_question.id}", params: { id: 'invalid-id' }
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
