require 'rails_helper'

RSpec.describe Api::V1::UsersController do
  let!(:user) { create :user }

  before(:each) do |example|
    sign_in(user) unless example.metadata[:logged_out]
  end

  describe 'PUT #update' do
    context 'with valid parameters' do
      subject { put "/api/v1/users/#{user.id}", params: { id: user.id, user: { not_ask_visibility: true } } }
      it 'updates the fun question' do
        subject
        expect(response).to have_http_status(:success)
        updated_user = User.find_by(id: user.id)
        expect(updated_user.not_ask_visibility).to eq(true)
      end
    end
  end

  describe 'GET #unsubscribe', :logged_out do
    let(:valid_token) do
      url = SignedLinks::UnsubscribeBuilder.url(user)
      Rack::Utils.parse_query(URI.parse(url).query)['token']
    end

    context 'with valid token' do
      it 'signs in the user and redirects' do
        get '/api/v1/unsubscribe', params: { token: valid_token }

        expect(controller.current_user).to eq(user)
        expect(response).to have_http_status(:redirect)
      end
    end

    context 'with invalid token' do
      it 'does not sign in' do
        get '/api/v1/unsubscribe', params: { token: 'invalid' }

        expect(controller.current_user).to be_nil
      end
    end

    context 'security: valid token for user A and user_id=B in query' do
      let(:user_b) { create(:user) }

      it 'signs in user A (from token), ignores params[:user_id]' do
        get '/api/v1/unsubscribe', params: { token: valid_token, user_id: user_b.id }

        expect(controller.current_user).to eq(user)
        expect(controller.current_user).not_to eq(user_b)
      end
    end
  end

  describe 'POST send_reminder (security: must not be exposed on public API)' do
    it 'has no route so reminder cannot be triggered via API' do
      expect { post "/api/v1/users/#{user.id}/send_reminder" }.to raise_error(ActionController::RoutingError)
    end
  end
end
