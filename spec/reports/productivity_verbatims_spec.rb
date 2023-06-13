require 'rails_helper'

RSpec.describe ProductivityVerbatims do
  let(:team) { create(:team) }
  let(:time_periods) { create_list(:time_period, 3) }
  let(:report) { ProductivityVerbatims.new(team, time_periods) }

  describe '#generate' do
    let!(:user1) { create(:user, teams: [team]) }
    let!(:user2) { create(:user, teams: [team]) }
    let!(:user3) { create(:user, teams: [team]) }

    let!(:response1) { create(:response, user: user1, time_period: time_periods[0], productivity: 1, bad_follow_comment: 'Not feeling productive') }
    let!(:response2) { create(:response, user: user2, time_period: time_periods[1], productivity: 5, bad_follow_comment: 'Feeling good!') }
    let!(:response3) { create(:response, user: user3, time_period: time_periods[2], productivity: 2, bad_follow_comment: 'Could be better') }

    it 'generates bad_follow_comment from responses with low productivity' do
      bad_follow_comment = report.generate
      expected_comments = [response1.bad_follow_comment, response3.bad_follow_comment]
      expect(bad_follow_comment).to eq(expected_comments)
    end

    it 'returns "No bad_follow_comment present" if no low productivity responses are found' do
      Response.where('productivity <= ?', 2).destroy_all
      bad_follow_comment = report.generate
      expect(bad_follow_comment).to eq('No comments present')
    end
  end
end
