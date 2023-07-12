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
  has_many :user_teams, dependent: :destroy
  has_many :users, through: :user_teams
  before_validation :strip_name

  validates :name, presence: true, length: { maximum: 100 }, uniqueness: true

  private

  def strip_name
    self.name = name.strip unless name.nil?
  end
end
