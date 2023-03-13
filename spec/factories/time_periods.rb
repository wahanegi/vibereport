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
FactoryBot.define do
  factory :time_period do
    sequence(:start_date) { |n| Date.current + n.days }
    sequence(:end_date) { |n| Date.current + n.days + 6.days }
  end
end
