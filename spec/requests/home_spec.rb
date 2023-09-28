require 'rails_helper'

RSpec.describe 'Homes', type: :request do
  let!(:user) { create :user }
  before(:each) do
    sign_in(user)
  end

  describe 'GET /index' do
    it 'returns http found' do
      get '/'
      expect(response).to have_http_status(:found)
    end
  end

  describe 'GET /app' do
    it 'returns http success' do
      get '/app'
      expect(response).to have_http_status(:success)
    end
  end
end
