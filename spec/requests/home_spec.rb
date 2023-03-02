require 'rails_helper'
require "passwordless/test_helpers"

RSpec.describe "Homes", type: :request do
  let!(:user) { create :user }
  before(:each) do
    passwordless_sign_in(user)
  end

  describe "GET /index" do
    it "returns http found" do
      get '/'
      expect(response).to have_http_status(:found)
    end
  end

  describe "GET /app" do
    it "returns http success" do
      get "/app"
      expect(response).to have_http_status(:success)
    end
  end
end
