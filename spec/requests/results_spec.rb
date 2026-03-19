require 'rails_helper'

RSpec.describe Api::V1::ResultsController do
  let!(:user) { create :user }
  let(:time_period) { create :time_period }

  before(:each) do |test|
    sign_in(user) unless test.metadata[:logged_out]
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

  describe 'GET #results_email', :logged_out do
    let(:valid_token) do
      url = SignedLinks::ResultsEmailBuilder.url(user, time_period)
      Rack::Utils.parse_query(URI.parse(url).query)['token']
    end

    context 'with valid token' do
      before { create(:response, user: user, time_period: time_period) }

      it 'signs in the user and redirects to results' do
        get '/api/v1/results_email', params: { token: valid_token }

        expect(controller.current_user).to eq(user)
        expect(response).to have_http_status(:redirect)
      end
    end

    context 'with invalid token' do
      it 'does not sign in' do
        get '/api/v1/results_email', params: { token: 'invalid' }

        expect(controller.current_user).to be_nil
        expect(response).to have_http_status(:redirect).or have_http_status(:unauthorized)
      end
    end

    context 'security: valid token for user A and user_id=B in query' do
      let(:user_b) { create(:user) }

      it 'signs in user A (from token), ignores params' do
        get '/api/v1/results_email', params: { token: valid_token, user_id: user_b.id, slug: 'other-slug' }

        expect(controller.current_user).to eq(user)
        expect(controller.current_user).not_to eq(user_b)
      end
    end

    # TODO: Remove this context after LEGACY_EMAIL_LINKS_CUTOFF_DATE passes.
    context 'with legacy params (no token)', :legacy_link_support do
      before do
        stub_const('ENV', ENV.to_h.merge('LEGACY_EMAIL_LINKS_CUTOFF_DATE' => 1.day.from_now.to_date.to_s))
        create(:response, user: user, time_period: time_period)
      end

      it 'signs in user and redirects to results when user_id and slug present' do
        get '/api/v1/results_email', params: { user_id: user.id, slug: time_period.slug }

        expect(controller.current_user).to eq(user)
        expect(response).to have_http_status(:redirect)
      end

      it 'redirects to invalid link when user_id is missing' do
        get '/api/v1/results_email', params: { slug: time_period.slug }

        expect(controller.current_user).to be_nil
        expect(response).to redirect_to(new_user_session_path)
      end

      context 'when legacy period has passed' do
        before do
          stub_const('ENV', ENV.to_h.merge('LEGACY_EMAIL_LINKS_CUTOFF_DATE' => 1.day.ago.to_date.to_s))
        end

        it 'does not sign in even with valid legacy params' do
          get '/api/v1/results_email', params: { user_id: user.id, slug: time_period.slug }

          expect(controller.current_user).to be_nil
        end
      end
    end
  end
end
