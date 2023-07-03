require 'rails_helper'

RSpec.describe ResponsesReport do
  let(:team) { create(:team) }
  let(:time_periods) { create_list(:time_period, 3) }
  let(:report) { ResponsesReport.new(team, time_periods) }

  describe '#generate' do
    let!(:user1) { create(:user) }
    let!(:user2) { create(:user) }
    let!(:user3) { create(:user) }

    let!(:responses1) { create_list(:response, 2, time_period: time_periods[0]) { |response| response.user = user1 } }
    let!(:responses2) { create_list(:response, 3, time_period: time_periods[1]) { |response| response.user = user2 } }
    let!(:responses3) { create_list(:response, 1, time_period: time_periods[2]) { |response| response.user = user3 } }

    it 'generates a response report' do
      generated_data = report.generate

      expect(generated_data[0]).to be_present
      expect(generated_data[1]).to be_present
    end
  end
end
