# == Schema Information
#
# Table name: teams
#
#  id         :bigint           not null, primary key
#  name       :string(100)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_teams_on_name  (name) UNIQUE
#
class Team < ApplicationRecord
  has_many :users_teams, dependent: :destroy
  has_many :users, through: :users_teams

  validates :name, presence: true, length: { maximum: 100 }, uniqueness: true
end
