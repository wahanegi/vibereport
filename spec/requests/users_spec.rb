require 'rails_helper'
require 'passwordless/test_helpers'

RSpec.describe Api::V1::UsersController do
  let!(:user) { create :user }

  before(:each) do |test|
    passwordless_sign_in(user) unless test.metadata[:logged_out]
  end

  describe 'PUT #update' do
    context 'with valid parameters' do
      subject { put "/api/v1/users/#{user.id}", params: { id: user.id, user: { not_ask_visibility: true } } }
      it 'updates the fun question' do
        subject
        expect(response).to have_http_status(:success)
        updated_user = User.find_by(id: user.id)
        expect(updated_user.not_ask_visibility).to eq(true)
      end
    end
  end
end
