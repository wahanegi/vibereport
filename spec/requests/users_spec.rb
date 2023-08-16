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

  describe 'POST #send_reminder' do
    context 'when sending reminder to user' do
      let(:mailer) { double("UserEmailMailer", deliver_now: true) }
      
      before do
        allow(UserEmailMailer).to receive(:send_reminder).and_return(mailer)
        post send_reminder_api_v1_user_path(user.id)
      end

      it 'sends the reminder email' do
        expect(UserEmailMailer).to have_received(:send_reminder)
      end
      
      it 'redirects to the admin dashboard path' do
        expect(response).to redirect_to(admin_dashboard_path)
      end
      
      it 'displays the success notice' do
        expect(flash[:notice]).to eq("Reminder sent to #{user.full_name}")
      end
    end
  end
end
