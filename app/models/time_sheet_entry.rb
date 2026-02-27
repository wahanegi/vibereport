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
class TimeSheetEntry < ApplicationRecord
  MAX_BILLABLE_HOURS = 40
  belongs_to :user
  belongs_to :project
  belongs_to :time_period

  validates :total_hours, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validate :billable_hours_limit, if: -> { project&.billable? }

  scope :billable, lambda {
    joins(:project).where(projects: { usage: 'billable' })
  }
  scope :for_users_and_periods, lambda { |user_ids, period_ids|
    where(user_id: user_ids, time_period_id: period_ids)
  }

  def self.ransackable_attributes(_auth_object = nil)
    %w[id total_hours project_id time_period_id user_id]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[project time_period user]
  end

  private

  def existing_billable_hours
    TimeSheetEntry
      .billable
      .where(user_id: user.id, time_period_id: time_period.id)
      .where.not(id: id)
      .sum(:total_hours)
  end

  def billable_hours_limit
    total_billable_hours = existing_billable_hours + (total_hours || 0)
    return unless total_billable_hours > MAX_BILLABLE_HOURS

    errors.add(:total_hours, "Billable projects may not exceed #{MAX_BILLABLE_HOURS} hours in a work week")
  end
end
