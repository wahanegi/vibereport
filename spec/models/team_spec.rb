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
    let(:team) { create(:team) }
    let(:long_name) { 'a' * 101 }

    it 'validates name length' do
      team.name = long_name
      expect(team).not_to be_valid
    end
  end

  describe 'Factory' do
    let(:team) { build(:team) }

    it 'factory works' do
      expect(team).to be_valid
    end
  end
end
