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
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:project) }
    it { is_expected.to belong_to(:time_period) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:total_hours) }
    it { is_expected.to validate_numericality_of(:total_hours).only_integer.is_greater_than_or_equal_to(0) }
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
