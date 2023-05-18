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
  describe 'Associations' do
    it { should belong_to(:user) }
    it { should belong_to(:team) }
  end

  describe 'Validations' do
    let(:user) { create(:user) }
    let(:team) { create(:team) }
    subject { UsersTeam.new(user: user, team: team) }

    it { should validate_uniqueness_of(:user_id).scoped_to(:team_id).with_message("User should belong to a team only once") }
  end
end
