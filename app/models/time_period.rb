# == Schema Information
#
# Table name: time_periods
#
#  id         :bigint           not null, primary key
#  end_date   :date
#  start_date :date
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class TimePeriod < ApplicationRecord

  validates :end_date, :start_date, presence: true
  validates :end_date, comparison: { greater_than: :start_date }
  validate :start_date_validation

  def self.create_time_period
    start_date = Date.current.beginning_of_week(:sunday)
    end_date = start_date + 6.days
    TimePeriod.create(start_date: start_date, end_date: end_date)
  end

  private

  def start_date_validation
    return true if TimePeriod.all.blank?
    return false if start_date.blank?

    errors.add(:time_period, 'invalid start_date') if start_date < TimePeriod.all.order(:end_date).last&.end_date
  end
end
