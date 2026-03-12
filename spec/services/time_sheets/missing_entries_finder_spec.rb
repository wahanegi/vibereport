require 'rails_helper'

RSpec.describe TimeSheets::MissingEntriesFinder do
  let!(:team) { create(:team, timesheet_enabled: true) }
  let!(:user) { create(:user, opt_out: false) }
  let!(:user_team) { create(:user_team, user: user, team: team, created_at: 2.months.ago) }

  let!(:period1) { create(:time_period, start_date: 2.weeks.ago.to_date) }
  let!(:period2) { create(:time_period, start_date: 1.week.ago.to_date) }
  let!(:period3) { create(:time_period, start_date: 3.weeks.ago.to_date) }

  subject do
    described_class.new(
      time_periods: TimePeriod.where(id: [period1.id, period2.id, period3.id])
    ).call
  end

  context 'when user has entry only for one period' do
    before do
      create(
        :time_sheet_entry,
        user: user,
        time_period: period1
      )
    end

    it 'returns only missing period' do
      expect(subject[user]).to contain_exactly(period2, period3)
    end
  end

  context 'when user has multiple missing and completed periods' do
    before do
      create(:time_sheet_entry, user: user, time_period: period2)
    end

    it 'returns all missing periods for the user' do
      expect(subject[user]).to contain_exactly(period1, period3)
    end
  end

  context 'when user has entries for all periods' do
    before do
      create(:time_sheet_entry, user: user, time_period: period1)
      create(:time_sheet_entry, user: user, time_period: period2)
      create(:time_sheet_entry, user: user, time_period: period3)
    end

    it 'does not include user in result' do
      expect(subject).to be_empty
    end
  end

  context 'when user belongs to multiple teams with mixed timesheet settings' do
    let!(:team_timesheet_enabled)  { create(:team, timesheet_enabled: true) }
    let!(:team_timesheet_disabled) { create(:team, timesheet_enabled: false) }

    before do
      create(:user_team, user: user, team: team_timesheet_enabled, created_at: 2.months.ago)
      create(:user_team, user: user, team: team_timesheet_disabled, created_at: 2.months.ago)
    end

    it 'includes user if at least one team has timesheet_enabled' do
      expect(subject.keys).to include(user)
    end
  end

  context 'when user has opted out' do
    let!(:opted_out_user) { create(:user, opt_out: true) }

    before do
      create(:user_team, user: opted_out_user, team: team, created_at: 2.months.ago)
    end

    it 'does not include opted out users' do
      expect(subject.keys).not_to include(opted_out_user)
    end
  end

  context 'when user does not belong to any team' do
    let!(:lonely_user) { create(:user, opt_out: false) }

    it 'does not include user' do
      expect(subject.keys).not_to include(lonely_user)
    end
  end

  context 'when user belongs only to teams without timesheet requirement' do
    let!(:team_timesheet_disabled) { create(:team, timesheet_enabled: false) }
    let!(:user_without_enabled_team) { create(:user, opt_out: false) }

    before do
      create(:user_team, user: user_without_enabled_team, team: team_timesheet_disabled, created_at: 2.months.ago)
    end

    it 'does not include user' do
      expect(subject).not_to include(user_without_enabled_team)
    end
  end

  context 'when multiple users exist' do
    let!(:user2) { create(:user, opt_out: false) }

    before do
      create(:user_team, user: user2, team: team, created_at: 2.months.ago)
      create(:time_sheet_entry, user: user, time_period: period1)
      create(:time_sheet_entry, user: user2, time_period: period2)
    end

    it 'returns missing periods for each eligible user separately' do
      expect(subject[user]).to contain_exactly(period2, period3)
      expect(subject[user2]).to contain_exactly(period1, period3)
    end
  end

  context 'when period started before user joined the team' do
    let!(:period_before) { create(:time_period, start_date: Date.new(2024, 2, 1), end_date: Date.new(2024, 2, 7), due_date: Date.new(2024, 2, 5)) }
    let!(:period_after) { create(:time_period, start_date: Date.new(2024, 3, 10), end_date: Date.new(2024, 3, 16), due_date: Date.new(2024, 3, 14)) }
    let!(:user_team) { create(:user_team, user: user, team: team, created_at: Time.utc(2024, 3, 1)) }

    subject do
      described_class.new(
        time_periods: TimePeriod.where(id: [period_before.id, period_after.id])
      ).call
    end

    it 'excludes period before join date and includes period after' do
      expect(subject[user]).to contain_exactly(period_after)
    end
  end

  context 'when period start_date equals user join date' do
    let!(:boundary_period) { create(:time_period, start_date: Date.new(2024, 3, 1), end_date: Date.new(2024, 3, 7), due_date: Date.new(2024, 3, 5)) }
    let!(:user_team) { create(:user_team, user: user, team: team, created_at: Time.utc(2024, 3, 1)) }

    subject do
      described_class.new(
        time_periods: TimePeriod.where(id: [boundary_period.id])
      ).call
    end

    it 'includes period when start_date equals join date' do
      expect(subject[user]).to contain_exactly(boundary_period)
    end
  end

  context 'when period after join date has no entry' do
    let!(:applicable_period) { create(:time_period, start_date: Date.new(2024, 2, 1), end_date: Date.new(2024, 2, 7), due_date: Date.new(2024, 2, 5)) }
    let!(:user_team) { create(:user_team, user: user, team: team, created_at: Time.utc(2024, 1, 1)) }

    subject do
      described_class.new(
        time_periods: TimePeriod.where(id: [applicable_period.id])
      ).call
    end

    it 'includes period in missing' do
      expect(subject[user]).to contain_exactly(applicable_period)
    end
  end

  context 'when user belongs to multiple timesheet teams with different join dates' do
    let!(:team_a) { create(:team, timesheet_enabled: true) }
    let!(:team_b) { create(:team, timesheet_enabled: true) }
    let!(:user_team_a) { create(:user_team, user: user, team: team_a, created_at: Time.utc(2024, 1, 1)) }
    let!(:user_team_b) { create(:user_team, user: user, team: team_b, created_at: Time.utc(2024, 3, 1)) }
    let!(:between_period) { create(:time_period, start_date: Date.new(2024, 2, 1), end_date: Date.new(2024, 2, 7), due_date: Date.new(2024, 2, 5)) }
    let!(:user_team) { create(:user_team, user: user, team: team, created_at: Time.utc(2024, 1, 1)) }

    subject do
      described_class.new(
        time_periods: TimePeriod.where(id: [between_period.id])
      ).call
    end

    it 'includes period when user joined any timesheet team before period ended' do
      expect(subject[user]).to contain_exactly(between_period)
    end
  end

  context 'when all periods are before user join date' do
    let!(:old_period_a) { create(:time_period, start_date: Date.new(2024, 10, 1), end_date: Date.new(2024, 10, 7), due_date: Date.new(2024, 10, 5)) }
    let!(:old_period_b) { create(:time_period, start_date: Date.new(2024, 11, 1), end_date: Date.new(2024, 11, 7), due_date: Date.new(2024, 11, 5)) }
    let!(:user_team) { create(:user_team, user: user, team: team, created_at: Time.utc(2024, 12, 1)) }

    subject do
      described_class.new(
        time_periods: TimePeriod.where(id: [old_period_a.id, old_period_b.id])
      ).call
    end

    it 'does not include user in result' do
      expect(subject.keys).not_to include(user)
    end
  end

  context 'when timesheet_memberships_for returns empty hash' do
    let!(:applicable_period) { create(:time_period, start_date: Date.new(2024, 2, 1), end_date: Date.new(2024, 2, 7), due_date: Date.new(2024, 2, 5)) }
    let!(:user_team) { create(:user_team, user: user, team: team, created_at: 2.months.ago) }

    it 'skips user without raising an exception' do
      finder = described_class.new(
        time_periods: TimePeriod.where(id: [applicable_period.id])
      )
      allow(finder).to receive(:timesheet_memberships_for).and_return({})

      result = finder.call

      expect(result).to be_empty
    end
  end
end
