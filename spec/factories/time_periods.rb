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
    start_date { Date.current - 14.days}
    end_date { Date.current - 13.day }
  end
end
