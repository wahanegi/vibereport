require 'rails_helper'
require 'passwordless/test_helpers'

RSpec.describe Api::V1::AnswerFunQuestionsController do
  let!(:user) { create :user }
  let!(:time_period) { create :time_period }
  let!(:fun_question) { create :fun_question }
  let!(:answer_fun_question) { create :answer_fun_question }

  let!(:valid_attributes) do
    {
      answer_fun_question: {
        user_id: user.id,
        fun_question_id: fun_question.id,
        answer_body: Faker::Lorem.sentences.first
      }
    }
  end

  let!(:invalid_attributes) do
    {
      answer_fun_question: {
        user_id: user.id,
        fun_question_id: fun_question.id,
        answer_body: ''
      }
    }
  end

  before(:each) do |test|
    passwordless_sign_in(user) unless test.metadata[:logged_out]
  end

  describe 'GET #show' do
    it 'returns a success response' do
      get "/api/v1/answer_fun_questions/#{answer_fun_question.id}"
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      subject { post '/api/v1/answer_fun_questions/', params: valid_attributes }
      it 'creates a new answer fun question' do
        expect { subject }.to change(AnswerFunQuestion, :count).by(1)
      end

      it 'renders a JSON response with the new answer fun question' do
        subject
        answer_fun_question = AnswerFunQuestion.last
        expect([response.parsed_body]).to eq [{ 'data' => {
          'id' => answer_fun_question.id.to_s,
          'type' => 'answer_fun_question',
          'attributes' =>
            {
              'id' => answer_fun_question.id,
              'answer_body' => answer_fun_question.answer_body
            }
        } }]
      end
    end

    context 'with invalid parameters' do
      subject { post '/api/v1/answer_fun_questions', params: invalid_attributes }
      it 'does not create a new fun question' do
        expect { subject }.to_not change(AnswerFunQuestion, :count)
      end

      it 'renders a JSON response with errors for the new answer fun question' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to eq('application/json; charset=utf-8')
        expect(response.body).to match("{\"error\":{\"answer_body\":[\"can't be blank\"]}}")
      end
    end
  end

  describe 'PATCH #update' do
    context 'with valid parameters' do
      subject { patch "/api/v1/answer_fun_questions/#{answer_fun_question.id}", params: { id: answer_fun_question.id, answer_fun_question: { answer_body: 'Updated answer' } } }
      it 'updates the answer fun question' do
        subject
        expect(response).to have_http_status(:success)
        updated_answer = AnswerFunQuestion.find_by(id: answer_fun_question.id)
        expect(updated_answer.answer_body).to eq('Updated answer')
      end

      it 'returns the updated answer fun question as JSON' do
        subject
        expect(response).to have_http_status(:success)
        response_answer_body = response.parsed_body.dig('data', 'attributes', 'answer_body')
        expect(response_answer_body).to eq('Updated answer')
      end
    end

    context 'with invalid parameters' do
      subject { patch "/api/v1/answer_fun_questions/#{answer_fun_question.id}", params: { id: answer_fun_question.id, answer_fun_question: { answer_body: '' } } }
      it 'returns an error message' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        response_body = response.parsed_body
        expect(response_body['error']['answer_body']).to include("can't be blank")
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'when the answer fun question exists' do
      subject { delete "/api/v1/answer_fun_questions/#{answer_fun_question.id}", params: { id: answer_fun_question.id } }
      it 'deletes the answer fun question' do
        expect { subject }.to change(AnswerFunQuestion, :count).by(-1)
      end

      it 'returns a 204 No Content status' do
        subject
        expect(response).to have_http_status(:no_content)
      end
    end

    context 'when the answer fun question does not exist' do
      it 'returns a 404 Not Found status' do
        delete "/api/v1/answer_fun_questions/#{answer_fun_question.id}", params: { id: 'invalid-id' }
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
