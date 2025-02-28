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
        users_count = team.users.count
        percentage = report.generate
        actual_responses_count = Response.where(user: team.users, time_period: time_periods).count
        total_possible_responses = users_count * time_periods.size
        expected_percentage = ((actual_responses_count.to_f / total_possible_responses) * 100).round(2)

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
