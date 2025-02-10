# == Schema Information
#
# Table name: projects
#
#  id         :bigint           not null, primary key
#  code       :string
#  company    :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_projects_on_code  (code) UNIQUE
#
require 'rails_helper'

RSpec.describe Project, type: :model do
  let!(:project) { create :project }

  context 'factory' do
    it 'is expected to have a valid factory' do
      expect(project).to be_valid
    end
  end

  context 'Validations' do
    describe 'company' do
      it { is_expected.to validate_presence_of(:company) }
      it { is_expected.to allow_value('Tech Corp').for(:company) }
    end

    describe 'code' do
      it { is_expected.to validate_presence_of(:code) }
      it { is_expected.to validate_uniqueness_of(:code) }
      it { is_expected.to allow_value('2024-PROJ-01').for(:code) }
    end

    describe 'name' do
      it { is_expected.to validate_presence_of(:name) }
      it { is_expected.to allow_value('Marketing Campaign').for(:name) }
    end
  end
end
