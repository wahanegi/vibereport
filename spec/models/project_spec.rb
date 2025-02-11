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

  context 'Callbacks' do
    describe 'before save normalize code' do
      it 'converts the code to uppercase before saving' do
        project = create(:project, code: 'abcd-1234')
        expect(project.code).to eq('ABCD-1234')
      end

      it 'does not change an already uppercase code' do
        project = create(:project, code: 'ABCD-1234')
        expect(project.code).to eq('ABCD-1234')
      end

      it 'removes leading and trailing spaces from code' do
        project = create(:project, code: '  abc-789  ')
        expect(project.code).to eq('ABC-789')
      end
    end
  end
end
