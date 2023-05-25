require 'rails_helper'

RSpec.describe ProductivityVerbatims do
  let(:team) { create(:team) }
  let(:time_periods) { create_list(:time_period, 3) }
  let(:report) { ProductivityVerbatims.new(team, time_periods) }

  describe '#generate' do
    let!(:user1) { create(:user, teams: [team]) }
    let!(:user2) { create(:user, teams: [team]) }
    let!(:user3) { create(:user, teams: [team]) }

    let!(:response1) { create(:response, user: user1, time_period: time_periods[0], productivity: 1, comment: 'Not feeling productive') }
    let!(:response2) { create(:response, user: user2, time_period: time_periods[1], productivity: 5, comment: 'Feeling good!') }
    let!(:response3) { create(:response, user: user3, time_period: time_periods[2], productivity: 2, comment: 'Could be better') }

    it 'generates comments from responses with low productivity' do
      comments = report.generate
      expected_comments = [response1.comment, response3.comment]
      expect(comments).to eq(expected_comments)
    end

    it 'returns "No comments available" if no low productivity responses are found' do
      Response.where('productivity <= ?', 2).destroy_all
      comments = report.generate
      expect(comments).to eq('No comments available')
    end
  end
end
