require 'rails_helper'

RSpec.describe DailyOverdueTimesheetWorker do
  let(:worker) { described_class.new }

  let!(:team) { create(:team, timesheet_enabled: true) }
  let!(:user) { create(:user, opt_out: false) }
  let!(:user_team) { create(:user_team, user: user, team: team) }
  let!(:overdue_period) { create(:time_period, start_date: 3.weeks.ago.to_date, end_date: 2.weeks.ago.to_date, due_date: 10.days.ago.to_date) }

  let(:force_date) { Date.current.strftime('%m-%d-%Y') }

  before do
    stub_const('ENV', ENV.to_hash.merge(
                        'TIMESHEET_START_FORCED_ENTRY_DATE' => force_date
                      ))
  end

  describe '#run_notification' do
    context 'when called on a weekday' do
      before do
        stubbed_date = Date.new(2026, 2, 17)
        allow(Date).to receive(:current).and_return(stubbed_date)
        stub_const('ENV', ENV.to_hash.merge('TIMESHEET_START_FORCED_ENTRY_DATE' => stubbed_date.strftime('%m-%d-%Y')))
      end

      it 'calls run and sends emails' do
        expect { worker.run_notification }
          .to change { ActionMailer::Base.deliveries.count }.by(1)
      end
    end

    context 'when called on a weekend' do
      before { allow(Date).to receive(:current).and_return(Date.new(2026, 2, 15)) }

      it 'does not send any emails' do
        expect { worker.run_notification }
          .not_to change { ActionMailer::Base.deliveries.count }
      end
    end
  end

  describe '#run' do
    context 'when force date has been reached and there are missing entries' do
      it 'sends reminder emails to users with missing timesheets' do
        expect { worker.run }
          .to change { ActionMailer::Base.deliveries.count }.by(1)

        email = ActionMailer::Base.deliveries.last

        expect(email.to).to include(user.email)
        expect(email.subject).to eq('Action Required: Overdue Timesheet(s)')
      end
    end

    context 'when force date has not been reached yet' do
      let(:force_date) { (Date.current + 5.days).strftime('%m-%d-%Y') }

      it 'does not send any emails' do
        expect { worker.run }
          .not_to change { ActionMailer::Base.deliveries.count }
      end
    end

    context 'when TIMESHEET_START_FORCED_ENTRY_DATE env is not set' do
      before do
        stub_const('ENV', ENV.to_hash.except('TIMESHEET_START_FORCED_ENTRY_DATE'))
      end

      it 'does not send any emails' do
        expect { worker.run }
          .not_to change { ActionMailer::Base.deliveries.count }
      end
    end

    context 'when TIMESHEET_START_FORCED_ENTRY_DATE has invalid format' do
      let(:force_date) { 'not-a-date' }

      it 'does not send any emails' do
        expect { worker.run }
          .not_to change { ActionMailer::Base.deliveries.count }
      end

      it 'logs an error' do
        expect(Rails.logger).to receive(:error).with(/Invalid TIMESHEET_START_FORCED_ENTRY_DATE/)

        worker.run
      end
    end

    context 'when all users have submitted their timesheets' do
      before do
        create(:time_sheet_entry, user: user, time_period: overdue_period)
      end

      it 'does not send any emails' do
        expect { worker.run }
          .not_to change { ActionMailer::Base.deliveries.count }
      end
    end

    context 'when there are no overdue time periods' do
      before { overdue_period.update!(due_date: Date.current + 5.days) }

      it 'does not send any emails' do
        expect { worker.run }
          .not_to change { ActionMailer::Base.deliveries.count }
      end
    end

    context 'with multiple users having missing entries' do
      let!(:user2) { create(:user, opt_out: false) }
      let!(:user_team2) { create(:user_team, user: user2, team: team) }

      it 'sends an email to each user with missing timesheets' do
        expect { worker.run }
          .to change { ActionMailer::Base.deliveries.count }.by(2)

        recipients = ActionMailer::Base.deliveries.last(2).flat_map(&:to)

        expect(recipients).to contain_exactly(user.email, user2.email)
      end
    end

    context 'when user opted out' do
      before { user.update!(opt_out: true) }

      it 'does not send email to opted-out user' do
        expect { worker.run }
          .not_to change { ActionMailer::Base.deliveries.count }
      end
    end

    context 'when user has no team with timesheet enabled' do
      before { team.update!(timesheet_enabled: false) }

      it 'does not send any emails' do
        expect { worker.run }
          .not_to change { ActionMailer::Base.deliveries.count }
      end
    end
  end
end
