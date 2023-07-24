require 'rails_helper'
RSpec.describe 'Admin::LogoPage', type: :request do
  let!(:admin_user) { create :admin_user }
  let!(:logo) { create :logo, :image, type: 'Logo' }

  before { sign_in admin_user }

  describe 'GET - index' do
    it 'renders the index page' do
      get '/admin/logos'
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Show' do
    it 'renders the show page' do
      get "/admin/logos/#{logo.id}"
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Edit' do
    it 'renders the edit page' do
      get "/admin/logos/#{logo.id}/edit"
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Update' do
    it 'updates logo' do
      patch "/admin/logos/#{logo.id}", params: { id: logo.id }
      expect(response).to redirect_to(admin_logos_path)
    end
  end
end
