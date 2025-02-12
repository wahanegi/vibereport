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
require 'rails_helper'

RSpec.describe TimePeriod, type: :model do
  let!(:time_period1) { create :time_period }
  let!(:time_period2) { create :time_period }

  context 'scopes' do
    let!(:teams) { create_list(:team, 3) }
    let!(:users) do
      teams.map { |team| create(:user, teams: [team]) }
    end
    let!(:time_periods) do
      (0...3).map do |index|
        create(:time_period,
               start_date: Date.current + index.weeks,
               end_date: (Date.current + 6.days) + index.weeks,
               due_date: (Date.current + 4.days) + index.weeks)
      end
    end
    let!(:responses) do
      time_periods.map do |time_period|
        create(:response, time_period:, user: users.sample)
      end
    end
    let(:first_team) { teams.first }

    it 'sorts by start_date in descending order' do
      expect(TimePeriod.ordered).to match_array(TimePeriod.order(start_date: :desc))
    end

    it 'joins responses where the user belongs to the team' do
      time_periods_by_team = TimePeriod.joins(responses: { user: :user_teams }).where(user_teams: { team_id: first_team.id })

      expect(TimePeriod.with_responses_by_team(first_team)).to match_array(time_periods_by_team)
    end
  end

  context 'Create multiple factories' do
    it 'multiple factories being instantiated works' do
      expect(create(:time_period)).to be_valid
      expect(create(:time_period)).to be_valid
    end
  end

  context 'associations' do
    it 'has many responses' do
      expect(time_period1).to have_many(:responses).dependent(:destroy)
    end

    it 'has many emotions trough responses' do
      expect(time_period1).to have_many(:emotions)
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

  describe 'model methods' do
    before(:each) do
      TimePeriod.destroy_all
      allow(ENV).to receive(:[]).with('START_WEEK_DAY').and_return('monday')
      allow(ENV).to receive(:[]).with('DAY_TO_SEND_INVITES').and_return('friday')
    end

    context '#create_time_period' do
      it 'uses a mocked environment variable' do
        start_week = ENV['START_WEEK_DAY']
        due_date_week = ENV['DAY_TO_SEND_INVITES']
        expect(start_week).to eq('monday')
        expect(due_date_week).to eq('friday')
      end
      it 'should create new time period record' do
        last_monday = Date.current.beginning_of_week(:monday)
        new_time_period = TimePeriod.create_time_period
        expect(new_time_period.start_date).to eq(last_monday)
        expect(new_time_period.end_date).to eq(last_monday + 6.days)
        expect(new_time_period.due_date).to eq(last_monday + 4.days)
      end
    end

    context '#current' do
      it 'return current time period' do
        current_time_period = FactoryBot.create(:time_period, start_date: Date.current, end_date: Date.current + 6.days)
        expect(TimePeriod.current).to eq(current_time_period)
      end
    end

    context '#date_range' do
      it 'returns the correct date range string' do
        expect(time_period1.date_range).to eq("#{time_period1.start_date.strftime('%Y-%m-%d')} - #{time_period1.end_date.strftime('%Y-%m-%d')}")
      end
    end

    context '#find_or_create_time_period' do
      subject { TimePeriod.find_or_create_time_period }

      it 'should create new time period' do
        expect { subject }.to change { TimePeriod.count }.by(1)
      end
      it 'should return current time period' do
        current_time_period = FactoryBot.create(:time_period, start_date: Date.current, end_date: Date.current + 6.days, due_date: Date.current + 4.days)
        expect(subject).to eq(current_time_period)
      end
    end
  end
end
