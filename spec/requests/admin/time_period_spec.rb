require 'rails_helper'
RSpec.describe "Admin::TimePeriod", type: :request do
  let!(:admin) { create :admin_user }
  before { sign_in admin }

  describe "GET - index" do
    it "renders the index page" do
      get "/admin/time_periods"
      expect(response).to have_http_status(200)
    end
  end

  describe "GET - Show" do
    let(:time_period) { create :time_period }

    it "renders the show page" do
      get "/admin/time_periods/#{time_period.id}"
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Edit' do
    let(:time_period) { create :time_period }

    it 'renders the edit page' do
      get "/admin/time_periods/#{time_period.id}/edit"
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET - Update' do
    let(:time_period) { create :time_period }

    it 'updates time_period' do
      new_start_date = Date.current + 2.days
      new_end_date = new_start_date + 6.days
      patch "/admin/time_periods/#{time_period.id}", params: { id: time_period.id, time_period: { start_date: new_start_date, end_date: new_end_date } }
      expect(response).to redirect_to(admin_time_period_path(time_period))
      expect(time_period.reload.start_date).to eq(new_start_date)
      expect(time_period.reload.end_date).to eq(new_end_date)
    end
  end
end
