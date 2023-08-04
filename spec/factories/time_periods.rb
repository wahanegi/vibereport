# == Schema Information
#
# Table name: time_periods
#
#  id         :bigint           not null, primary key
#  due_date   :date
#  end_date   :date
#  slug       :string
#  start_date :date
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_time_periods_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :time_period do
    sequence(:start_date) { |n| Date.current + n.days }
    sequence(:end_date) { |n| Date.current + n.days + 6.days }
    sequence(:due_date) { |n| Date.current + n.days + 4.days }
  end
end
