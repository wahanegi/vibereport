# == Schema Information
#
# Table name: projects
#
#  id         :bigint           not null, primary key
#  code       :string
#  company    :string
#  deleted_at :date
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
  let!(:project_with_entries) { create :project }
  let!(:time_entry) { create(:time_sheet_entry, project: project_with_entries) }

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
      it { is_expected.to validate_uniqueness_of(:code).case_insensitive }
      it { is_expected.to allow_value('2024-PROJ-01').for(:code) }

      context 'edge cases for uniqueness' do
        let!(:project1) { create(:project, code: 'ABC-321') }
        let!(:project2) { build(:project) }

        it 'does not allow duplicate codes even with different letter cases' do
          project2.code = 'aBc-321'
          expect(project2.valid?).to be_falsey
          expect(project2.save).to be_falsey
          expect(project2.errors[:code]).to include('has already been taken')
        end

        it 'does not allow duplicate codes even with extra spaces' do
          project2.code = '  ABC-321  '
          expect(project2.valid?).to be_falsey
          expect(project2.save).to be_falsey
          expect(project2.errors[:code]).to include('has already been taken')
        end

        it 'allows codes that have a different structure but similar characters' do
          project2.code = 'ABCD-321'
          expect(project2.valid?).to be_truthy
        end

        it 'allows different codes if numbers are at different positions' do
          project2.code = '321-ABC'
          expect(project2.valid?).to be_truthy
        end
      end
    end

    describe 'name' do
      it { is_expected.to validate_presence_of(:name) }
      it { is_expected.to allow_value('Marketing Campaign').for(:name) }
    end
  end

  context 'Associations' do
    it { is_expected.to have_many(:time_sheet_entries).dependent(:destroy) }
  end

  context 'Normalizes' do
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

  context 'Soft delete functionality' do
    describe '#soft_delete' do
      it 'soft deletes a project by setting deleted_at' do
        expect { project.soft_delete }.to change { project.reload.deleted_at }.from(nil)
        expect(project.deleted_at).to be_a(Date)
      end
    end

    describe '#restore' do
      it 'restores a soft-deleted project by clearing deleted_at' do
        project.soft_delete
        expect { project.restore }.to change { project.reload.deleted_at }.to(nil)
      end
    end

    describe '#destroy' do
      context 'with no time_sheet_entries' do
        it 'performs a hard deletion and returns :hard_deleted' do
          expect(project.destroy).to eq(:hard_deleted)
          expect(Project.find_by(id: project.id)).to be_nil
          expect(Project.count).to eq(1)
        end
      end

      context 'with time_sheet_entries' do
        it 'performs a soft deletion, leaves entries intact, and returns :soft_deleted' do
          expect(project_with_entries.destroy).to eq(:soft_deleted)
          expect(project_with_entries.reload.deleted_at).to be_present
          expect(TimeSheetEntry.find_by(id: time_entry.id)).to be_present
          expect(Project.count).to eq(2)
        end
      end
    end

    describe '#destroy!' do
      context 'with no time_sheet_entries' do
        it 'performs a hard deletion without raising an error' do
          expect { project.destroy! }.to change(Project, :count).by(-1)
          expect(Project.find_by(id: project.id)).to be_nil
        end
      end

      context 'with time_sheet_entries' do
        it 'performs a hard deletion and deletes associated time_sheet_entries' do
          expect { project_with_entries.destroy! }.to change(Project, :count).by(-1)
                                                                             .and change(TimeSheetEntry, :count).by(-1)
          expect(Project.find_by(id: project_with_entries.id)).to be_nil
          expect(TimeSheetEntry.find_by(id: time_entry.id)).to be_nil
        end
      end
    end
  end
end
