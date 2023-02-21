require 'rails_helper'
RSpec.describe "Admin::Emotions", type: :request do
  let!(:admin) { create :admin_user }
  before { sign_in admin }

  describe "GET - index" do
    it "renders the index page" do
      get "/admin/emotions"
      expect(response).to have_http_status(200)
    end
  end

  describe "GET - Show" do
    let(:emotion) { create :emotion }

    it "renders the show page" do
      get "/admin/emotions/#{emotion.id}"
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Edit' do
    let(:emotion) { create :emotion }

    it 'renders the edit page' do
      get "/admin/emotions/#{emotion.id}/edit"
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Update' do
    let(:emotion) { create :emotion }

    it 'updates emotion' do
      patch "/admin/emotions/#{emotion.id}", params: { id: emotion.id, emotion: { word: 'so-so' } }
      expect(response).to redirect_to(admin_emotion_path(emotion))
      expect(emotion.reload.word).to eq 'so-so'
    end
  end
end
