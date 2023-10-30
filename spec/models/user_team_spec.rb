# == Schema Information
#
# Table name: user_teams
#
#  id         :bigint           not null, primary key
#  role       :integer          default("member"), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  team_id    :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_user_teams_on_team_id              (team_id)
#  index_user_teams_on_user_id              (user_id)
#  index_user_teams_on_user_id_and_team_id  (user_id,team_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (team_id => teams.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe UserTeam, type: :model do
  let(:team) { create(:team) }
  let(:manager_user) { create(:user) }
  let(:observer_user) { create(:user) }
  let(:member_user) { create(:user) }
  let(:user_team) { create(:user_team) }
  let(:manager_user_team) { create(:user_team, user: manager_user, team:, role: :manager) }
  let(:member_user_team) { create(:user_team, user: member_user, team:, role: :member) }
  let(:observer_user_team) { create(:user_team, user: observer_user, team:, role: :observer) }

  it 'factory works' do
    expect(user_team).to be_valid
  end

  describe 'Associations' do
    it { should belong_to(:user) }
    it { should belong_to(:team) }
  end

  describe 'Validations' do
    it { expect(user_team).to validate_uniqueness_of(:user_id).scoped_to(:team_id) }
  end

  describe 'scopes' do
    describe 'managers' do
      it 'returns user teams with managers' do
        managers = UserTeam.managers
        expect(managers).to include(manager_user_team)
        expect(managers).not_to include(member_user_team)
      end
    end

    describe 'has_team_access' do
      it 'returns user teams with managers and observers' do
        has_team_access = UserTeam.has_team_access
        expect(has_team_access).to include(manager_user_team)
        expect(has_team_access).to include(observer_user_team)
        expect(has_team_access).not_to include(member_user_team)
      end
    end
  end
end
