# spec/controllers/api/v1/logo_controller_spec.rb

require 'rails_helper'

RSpec.describe Api::V1::LogoController, type: :controller do
  describe 'GET #index' do
    context 'when a logo with type "Logo" exists' do
      let!(:logo) { create :logo, :image }

      it 'returns the image_url of the last "Logo" type logo' do
        get :index
        expect(response).to have_http_status(:ok)
        expect(response.body).to eq(logo.image_url)
      end
    end

    context 'when no logo with type "Logo" exists' do
      it 'returns an empty JSON object with status :ok' do
        get :index
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq({})
      end
    end
  end
end
