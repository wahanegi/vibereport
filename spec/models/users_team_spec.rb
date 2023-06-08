# == Schema Information
#
# Table name: users_teams
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  team_id    :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_users_teams_on_team_id  (team_id)
#  index_users_teams_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (team_id => teams.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe UsersTeam, type: :model do
  let(:users_team) { create(:users_team) }
  
  it 'factory works' do
    expect(users_team).to be_valid
  end
  
  describe 'Associations' do
    it { should belong_to(:user) }
    it { should belong_to(:team) }
  end

  describe 'Validations' do
    it { expect(users_team).to validate_uniqueness_of(:user_id).scoped_to(:team_id) }
  end
end
