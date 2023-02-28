require 'rails_helper'
RSpec.describe "React", type: :request do
  let!(:user) { create :user }

  describe "GET - app" do
    it "renders the app page" do
      get "/app"
      expect(response).to have_http_status(200)
    end
  end

  describe "GET - index" do
    it "renders the index page" do
      get "/"
      expect(response).to have_http_status(200)
    end
  end
end
