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
#  index_users_teams_on_team_id              (team_id)
#  index_users_teams_on_user_id              (user_id)
#  index_users_teams_on_user_id_and_team_id  (user_id,team_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (team_id => teams.id)
#  fk_rails_...  (user_id => users.id)
#
class UsersTeam < ApplicationRecord
  belongs_to :user
  belongs_to :team

  validates :user_id, uniqueness: { scope: :team_id }
end
