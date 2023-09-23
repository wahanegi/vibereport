# == Schema Information
#
# Table name: user_teams
#
#  id         :bigint           not null, primary key
#  manager    :boolean          default(FALSE), not null
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
  let(:user_team) { create(:user_team) }

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
end
