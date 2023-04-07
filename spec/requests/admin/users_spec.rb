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
end
