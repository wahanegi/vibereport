require 'rails_helper'
RSpec.describe 'Admin::Users', type: :request do
  let!(:admin_user) { create :admin_user }
  before { sign_in admin_user }

  describe 'GET - index' do
    it 'renders the index page' do
      get '/admin/users'
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Show' do
    let(:user) { create :user }

    it 'renders the show page' do
      get "/admin/users/#{user.id}"
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Edit' do
    let(:user) { create :user }

    it 'renders the edit page' do
      get "/admin/users/#{user.id}/edit"
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Update' do
    let(:user) { create :user }

    it 'updates user' do
      patch "/admin/users/#{user.id}", params: { id: user.id, user: { email: 'user@example.com', password: 'User123456' } }
      expect(response).to redirect_to(admin_users_path)
      expect(user.reload.email).to eq 'user@example.com'
    end
  end

  describe 'POST send_reminder' do
    let(:user) { create :user }

    context 'when admin is signed in' do
      it 'sends reminder email and redirects to dashboard with notice' do
        expect(UserEmailMailer).to receive(:send_reminder).with(user, a_string_matching(/token=/)).and_call_original

        post send_reminder_admin_user_path(user)

        expect(response).to redirect_to(admin_dashboard_path)
        expect(flash[:notice]).to eq("Reminder sent to #{user.full_name}")
      end
    end
  end
end

RSpec.describe 'Admin::Users send_reminder (authorization)', type: :request do
  let(:user) { create :user }

  context 'when not signed in as admin' do
    it 'redirects to admin login and does not send email' do
      expect(UserEmailMailer).not_to receive(:send_reminder)

      post send_reminder_admin_user_path(user)

      expect(response).to redirect_to(new_admin_user_session_path)
    end
  end
end
