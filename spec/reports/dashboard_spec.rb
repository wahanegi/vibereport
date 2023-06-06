require 'rails_helper'
require 'rspec/rails'

RSpec.describe "Admin Dashboard", type: :request do
  let(:admin_user) { create(:admin_user) }

  before do
    sign_in admin_user
  end

  describe 'GET /admin/dashboard' do
    it 'renders the Dashboard page ' do
      get "/admin/dashboard"
      expect(response).to have_http_status(200)
    end
  end
end
