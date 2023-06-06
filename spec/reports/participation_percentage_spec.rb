require 'rails_helper'

RSpec.describe ParticipationPercentage do
  let(:team) { create(:team) }
  let(:time_periods) { create_list(:time_period, 3) }
  let(:report) { ParticipationPercentage.new(team, time_periods) }

  describe '#generate' do
    context 'when there are users in the team' do
      let!(:user1) { create(:user, teams: [team]) }
      let!(:user2) { create(:user, teams: [team]) }
      let!(:user3) { create(:user, teams: [team]) }

      let!(:response1) { create(:response, user: user1, time_period: time_periods[0]) }
      let!(:response2) { create(:response, user: user2, time_period: time_periods[1]) }

      it 'generates the response percentage' do
        percentage = report.generate
        expected_percentage = (2.0 / 3 * 100).round(2)
        expect(percentage).to eq(expected_percentage)
      end
    end

    context 'when there are no users in the team' do
      it 'returns "No users present"' do
        percentage = report.generate
        expect(percentage).to eq('No users present')
      end
    end
  end
end
