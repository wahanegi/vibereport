require 'rails_helper'

RSpec.describe ProductivityAverage do
  let(:team) { create(:team) }
  let(:time_periods) { create_list(:time_period, 3) }
  let(:report) { ProductivityAverage.new(team, time_periods) }

  describe '#generate' do
    let!(:user1) { create(:user, teams: [team]) }
    let!(:user2) { create(:user, teams: [team]) }
    let!(:user3) { create(:user, teams: [team]) }

    let!(:response1) { create(:response, user: user1, time_period: time_periods[0], productivity: 5) }
    let!(:response2) { create(:response, user: user2, time_period: time_periods[1], productivity: 7) }
    let!(:response3) { create(:response, user: user3, time_period: time_periods[2], productivity: 4) }

    it 'generates the productivity average' do
      average = report.generate
      expected_average = ((response1.productivity + response2.productivity + response3.productivity) / 3.0).round(2)
      expect(average).to eq(expected_average)
    end

    it 'returns "No productivity present" if no responses are found' do
      Response.destroy_all
      average = report.generate
      expect(average).to eq('No productivity present')
    end
  end
end
