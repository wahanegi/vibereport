require 'rails_helper'

RSpec.describe Api::V1::NotificationsController do
  let!(:user) { create :user }
  let!(:valid_attributes) do
    {
      notification: {
        details: Faker::Lorem.questions(number: 1).first
      }
    }
  end

  let!(:invalid_attributes) do
    {
      notification: {
        details: nil
      }
    }
  end

  before(:each) do |test|
    sign_in(user) unless test.metadata[:logged_out]
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      subject { post '/api/v1/notifications/', params: valid_attributes }
      it 'creates a new notification' do
        expect { subject }.to change(Notification, :count).by(1)
      end

      it 'renders a JSON response with success callback' do
        subject
        expect([response.parsed_body]).to eq [{ 'callback' => 'success' }]
      end
    end

    context 'with invalid parameters' do
      subject { post '/api/v1/notifications', params: invalid_attributes }
      it 'does not create a new notification' do
        expect { subject }.to_not change(FunQuestion, :count)
      end

      it 'renders a JSON response with errors for the new fun question' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to eq('application/json; charset=utf-8')
        expect(response.body).to match("{\"error\":{\"details\":[\"can't be blank\"]}}")
      end
    end
  end
end
