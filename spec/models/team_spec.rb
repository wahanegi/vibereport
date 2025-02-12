# == Schema Information
#
# Table name: teams
#
#  id                :bigint           not null, primary key
#  name              :string(100)      not null
#  timesheet_enabled :boolean
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_teams_on_name  (name) UNIQUE
#
require 'rails_helper'

RSpec.describe Team, type: :model do
  let(:team) { create(:team) }

  it 'factory works' do
    expect(team).to be_valid
  end

  describe 'Associations' do
    it { should have_many(:user_teams).dependent(:destroy) }
    it { should have_many(:users).through(:user_teams) }
  end

  describe 'Validations' do
    let(:long_name) { 'a' * 101 }

    it 'validates name length' do
      team.name = long_name
      expect(team).not_to be_valid
    end
  end

  context 'Callbacks' do
    describe '#strip_name' do
      let(:team) { build(:team, name: " Test Team ") }

      it 'strips leading and trailing whitespace from name before validation' do
        team.validate
        expect(team.name).to eq('Test Team')
      end
    end
  end
end
