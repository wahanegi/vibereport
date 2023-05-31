require 'rails_helper'
require 'rspec/rails'

RSpec.describe "Admin Dashboard", type: :request do
  let(:admin_user) { create(:admin_user) }
  let!(:current_period) { create(:time_period) }
  let!(:all_periods) { create_list(:time_period, 5) }

  before do
    sign_in admin_user
  end

  describe 'GET /admin/dashboard' do
    it 'displays the Time Period compared to Average' do
      get "/admin/dashboard"

      expect(response.body).to include('/ Average for all time periods')
      expect(response.body).to include('Emotion Index:')
      expect(response.body).to include('Productivity Average:')
      expect(response.body).to include('Celebrations Count:')
      expect(response.body).to include('Teammate Engagement Count:')
    end

    it 'displays the recent productivity verbatims panel' do
      get '/admin/dashboard'

      expect(response.body).to include('Recent Productivity Verbatims')
      expect(response.body).to include('Positive:')
      expect(response.body).to include('Neutral:')
      expect(response.body).to include('Negative:')
    end
  end
end
