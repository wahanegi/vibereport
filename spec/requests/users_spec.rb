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

  describe 'POST #send_reminder' do
    context 'when sending reminder to user' do
      let(:mailer) { double('UserEmailMailer', deliver_now: true) }

      before do
        allow(UserEmailMailer).to receive(:send_reminder).and_return(mailer)
        post send_reminder_api_v1_user_path(user.id)
      end

      it 'sends the reminder email' do
        expect(UserEmailMailer).to have_received(:send_reminder)
      end

      it 'passes user and a signed URL (with token) to the mailer' do
        expect(UserEmailMailer).to have_received(:send_reminder).with(user, a_string_matching(/token=/))
      end

      it 'redirects to the admin dashboard path' do
        expect(response).to redirect_to(admin_dashboard_path)
      end

      it 'displays the success notice' do
        expect(flash[:notice]).to eq("Reminder sent to #{user.full_name}")
      end
    end
  end
end
