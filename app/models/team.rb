# == Schema Information
#
# Table name: teams
#
#  id                :bigint           not null, primary key
#  name              :string(100)      not null
#  timesheet_enabled :boolean          default(FALSE), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
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
  validates :timesheet_enabled, inclusion: { in: [true, false] }

  def self.ransackable_attributes(_auth_object = nil)
    %w[id name timesheet_enabled]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[user_teams users]
  end

  private

  def strip_name
    name&.strip!
  end
end
