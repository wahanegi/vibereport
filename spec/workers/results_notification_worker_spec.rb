require 'rails_helper'

describe ResultsNotificationWorker do
  let!(:user1) { create :user }
  let!(:user2) { create :user }
  let!(:time_period) { create :time_period, start_date: Date.current, end_date: Date.current + 6.days }
  let!(:prev_time_period) { create :time_period, start_date: time_period.start_date - 7.days, end_date: time_period.start_date - 1.day }
  let(:worker) { ResultsNotificationWorker.new }
  let(:run_worker) { worker.run_notification }

  describe '.initialize' do
    it 'fetches all users' do
      expect(worker.users).to match_array([user1, user2])
    end
    it 'fetch time_period' do
      expect(worker.time_period).to eq(TimePeriod.previous_time_period)
    end
  end

  describe '#send_results_email' do
    let(:user) { create(:user) }
    let(:time_period) { create(:time_period) }

    context 'when sending the results_email' do
      it 'sends an email with the correct data' do
        allow(worker).to receive(:time_period_has_ended?).and_return(true)
        allow(worker).to receive(:user_has_response?).and_return(true)

        expect(UserEmailMailer).to receive(:results_email).with(user, time_period, an_instance_of(Array)).and_call_original

        expect do
          worker.send(:send_results_email, user, time_period)
        end.to change { ActionMailer::Base.deliveries.count }.by(1)

        email = ActionMailer::Base.deliveries.last
        expect(email.to).to include(user.email)
      end
    end
  end
end
