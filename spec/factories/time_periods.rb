FactoryBot.define do
  factory :time_period do
    start_date { Date.current - 14.days}
    end_date { Date.current - 13.day }
  end
end