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
require 'rails_helper'

RSpec.describe Team, type: :model do
  describe 'Associations' do
    it { should have_many(:users_teams).dependent(:destroy) }
    it { should have_many(:users).through(:users_teams) }
  end

  describe 'Validations' do
    subject { Team.new(name: 'Test Team') }

    it { should validate_presence_of(:name) }
    it { should validate_length_of(:name).is_at_most(100) }
    it { should validate_uniqueness_of(:name) }

    it 'should not be valid with a name longer than 100 characters' do
      long_name = 'a' * 101
      team = Team.new(name: long_name)
      expect(team).not_to be_valid
      expect(team.errors[:name]).to include('is too long (maximum is 100 characters)')
    end
  end
end
