require 'rails_helper'
RSpec.describe "Admin::AdminUser", type: :request do
  let!(:admin_user) { create :admin_user }
  before { sign_in admin_user }

  describe "GET - idex" do
    it "renders the index page" do
      get "/admin/admin_users"
      expect(response).to have_http_status(200)
    end
  end

  describe "GET - Show" do
    it "renders the show page" do
      get "/admin/admin_users/#{admin_user.id}"
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Edit' do
    it 'renders the edit page' do
      get "/admin/admin_users/#{admin_user.id}/edit"
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Update' do
    it 'updates admin' do
      patch "/admin/admin_users/#{admin_user.id}", params: { id: admin_user.id, admin_user: { email: 'new_admin@example.com', password: 'password1', password_confirmation: 'password1' } }
      expect(response).to redirect_to(admin_admin_user_path(admin_user))
      expect(admin_user.reload.email).to eq 'new_admin@example.com'
    end
  end
end
