require 'rails_helper'
require 'passwordless/test_helpers'

RSpec.describe Api::V1::ResultsController do
  let!(:user) { create :user }
  let(:time_period) { create :time_period }

  before(:each) do
    passwordless_sign_in(user)
  end

  describe 'GET #show' do
    subject { get "/api/v1/results/#{time_period.slug}" }

    it 'returns a success response' do
      subject
      expect(response).to have_http_status(:success)
    end

    it 'returns a failed response' do
      time_period.destroy
      subject
      expect(response).to have_http_status(:not_found)
    end
  end
end