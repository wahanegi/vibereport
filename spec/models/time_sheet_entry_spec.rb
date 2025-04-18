# == Schema Information
#
# Table name: time_sheet_entries
#
#  id             :bigint           not null, primary key
#  total_hours    :integer          not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  project_id     :bigint           not null
#  time_period_id :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_time_sheet_entries_on_project_id      (project_id)
#  index_time_sheet_entries_on_time_period_id  (time_period_id)
#  index_time_sheet_entries_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe TimeSheetEntry, type: :model do
  let(:user) { create :user }
  let(:time_period) { create :time_period }

  describe 'associations' do
    it { is_expected.to belong_to(:user).required }
    it { is_expected.to belong_to(:project).required }
    it { is_expected.to belong_to(:time_period).required }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:total_hours) }
    it { is_expected.to validate_numericality_of(:total_hours).only_integer.is_greater_than_or_equal_to(0) }

    context 'when project is billable' do
      let(:billable_project) { create(:project, usage: 'billable') }

      it 'allows exactly 40 billable hours' do
        time_sheet_entry = build(:time_sheet_entry, user: user, time_period: time_period, project: billable_project, total_hours: 40)
        expect(time_sheet_entry).to be_valid
      end

      it 'allows additional billable hours if existing hours are below 40' do
        create(:time_sheet_entry, user: user, time_period: time_period, project: billable_project, total_hours: 30)
        time_sheet_entry = build(:time_sheet_entry, user: user, time_period: time_period, project: billable_project, total_hours: 10)
        expect(time_sheet_entry).to be_valid
      end

      it 'will not allow more than 40 billable hours per time period' do
        create(:time_sheet_entry, user: user, time_period: time_period, project: billable_project, total_hours: 40)

        time_sheet_entry = build(:time_sheet_entry, user: user, time_period: time_period, project: billable_project, total_hours: 1)

        expect(time_sheet_entry).to_not be_valid
        expect(time_sheet_entry.errors[:total_hours]).to include('Billable projects may not exceed 40 hours in a work week')
      end
    end

    context 'when project is internal' do
      let(:internal_project) { create(:project, usage: 'internal') }

      it 'allows unlimited hours for internal projects' do
        time_sheet_entry = build(:time_sheet_entry, user: user, time_period: time_period, project: internal_project, total_hours: 100)
        expect(time_sheet_entry).to be_valid
      end

      it 'does not count internal hours toward billable limit' do
        create(:time_sheet_entry, user: user, time_period: time_period, project: internal_project, total_hours: 50)
        billable_project = create(:project, usage: 'billable')
        time_sheet_entry = build(:time_sheet_entry, user: user, time_period: time_period, project: billable_project, total_hours: 40)
        expect(time_sheet_entry).to be_valid
      end
    end
  end

  describe 'ransackable_attributes' do
    it 'returns the expected attributes' do
      expect(described_class.ransackable_attributes).to eq(%w[id total_hours project_id time_period_id user_id])
    end
  end

  describe 'ransackable_associations' do
    it 'returns the expected associations' do
      expect(described_class.ransackable_associations).to eq(%w[project time_period user])
    end
  end
end
