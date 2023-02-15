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
  let(:time_period) { create :time_period }

  context 'Validations' do
    subject { FactoryBot.create(:time_period) }
    it { is_expected.to validate_presence_of(:start_date) }
    it { is_expected.to validate_presence_of(:end_date) }

    it 'fails when end_date earlier then start_date' do
      time_period.end_date = time_period.start_date - 1.day
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
