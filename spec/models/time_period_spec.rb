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
require 'rails_helper'

RSpec.describe TimePeriod, type: :model do
  let!(:time_period1) { create :time_period }
  let!(:time_period2) { create :time_period }

  before(:each) do
    TimePeriod.destroy_all
  end

  context 'Create multiple factories' do
    it 'multiple factories being instantiated works' do
      expect(create :time_period).to be_valid
      expect(create :time_period).to be_valid
    end
  end

  context 'Validations' do
    subject { FactoryBot.create(:time_period) }
    it { is_expected.to validate_presence_of(:start_date) }
    it { is_expected.to validate_presence_of(:end_date) }

    it 'fails when end_date earlier then start_date' do
      time_period1.end_date = time_period1.start_date - 1.day
      expect(time_period1).to_not be_valid
    end
  end

  context '#create_time_period' do
    it 'should create new time period record' do
      last_sunday = Date.current.beginning_of_week(:sunday)
      new_time_period = TimePeriod.create_time_period

      expect{TimePeriod.create_time_period}.to change { TimePeriod.all.count }.by(1)
      expect(new_time_period.start_date).to eq(last_sunday)
      expect(new_time_period.end_date).to eq(last_sunday + 6.days)
    end
  end

  context '#current' do
    it 'return current time period' do
      current_time_period = FactoryBot.create(:time_period, start_date: Date.current, end_date: Date.current + 6.days)
      expect(TimePeriod.current).to eq(current_time_period)
    end
  end
end
