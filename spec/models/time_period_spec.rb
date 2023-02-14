require 'rails_helper'

RSpec.describe TimePeriod, type: :model do
  let!(:time_period3) { FactoryBot.create(:time_period, start_date: Date.current - 8.weeks, end_date: Date.current - 7.weeks) }
  let!(:time_period2) { FactoryBot.create(:time_period, start_date: Date.current - 6.weeks, end_date: Date.current - 5.weeks) }
  let!(:time_period1) { FactoryBot.create(:time_period, start_date: Date.current - 4.weeks, end_date: Date.current - 3.weeks) }
  let!(:time_period) { create :time_period }

  context 'Validations' do
    subject { FactoryBot.build(:time_period) }
    it { is_expected.to validate_presence_of(:start_date) }
    it { is_expected.to validate_presence_of(:end_date) }

    it 'fails when end_date earlier then start_date' do
      time_period.end_date = time_period.start_date - 1.day
      expect(time_period).to_not be_valid
    end

    it 'fails when start_date earlier then the latest end_date' do
      time_period.start_date = Date.current - 4.weeks
      expect(time_period).to_not be_valid
    end
  end

  context '.create_time_period' do
    it 'should create new time period record' do
      current_day = Date.current.beginning_of_week(:sunday)
      expect{TimePeriod.create_time_period}.to change { TimePeriod.all.count }.by(1)
      expect(TimePeriod.last.start_date).to eq current_day
      expect(TimePeriod.last.end_date).to eq current_day + 6.days
    end
  end
end
