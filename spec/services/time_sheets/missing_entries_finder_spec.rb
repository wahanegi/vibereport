require 'rails_helper'

RSpec.describe TimeSheets::MissingEntriesFinder do
  let!(:team) { create(:team, timesheet_enabled: true) }
  let!(:user) { create(:user, opt_out: false) }
  let!(:user_team) { create(:user_team, user: user, team: team) }

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
      create(:user_team, user: user, team: team_timesheet_enabled)
      create(:user_team, user: user, team: team_timesheet_disabled)
    end

    it 'includes user if at least one team has timesheet_enabled' do
      expect(subject.keys).to include(user)
    end
  end

  context 'when user has opted out' do
    let!(:opted_out_user) { create(:user, opt_out: true) }

    before do
      create(:user_team, user: opted_out_user, team: team)
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
      create(:user_team, user: user_without_enabled_team, team: team_timesheet_disabled)
    end

    it 'does not include user' do
      expect(subject).not_to include(user_without_enabled_team)
    end
  end

  context 'when multiple users exist' do
    let!(:user2) { create(:user, opt_out: false) }

    before do
      create(:user_team, user: user2, team: team)
      create(:time_sheet_entry, user: user, time_period: period1)
      create(:time_sheet_entry, user: user2, time_period: period2)
    end

    it 'returns missing periods for each eligible user separately' do
      expect(subject[user]).to contain_exactly(period2, period3)
      expect(subject[user2]).to contain_exactly(period1, period3)
    end
  end
end
