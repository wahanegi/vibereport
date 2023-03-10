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

  def self.create_time_period
    return if current_time_period.present?

    start_date = Date.current.beginning_of_week(:sunday)
    end_date = start_date + 6.days
    TimePeriod.create(start_date: start_date, end_date: end_date)
  end
  def self.current_time_period
    TimePeriod.find_by(start_date: Date.current.., end_date: ..Date.current + 6.days)
  end

  def self.current
    TimePeriod.find_by(start_date: ..Date.current, end_date: Date.current..)
  end
end
