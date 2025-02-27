require 'rails_helper'

RSpec.describe RemindCheckInEmailWorker do
  let!(:user_with_response) { create :user }
  let!(:user_without_response) { create :user }
  let!(:time_period) { create :time_period }
  let!(:emotion) { create :emotion }
  let(:response) { FactoryBot.create(:response, user: user_with_response, time_period:, emotion:, steps: %w[emotion-selection-web]) }
  let!(:fun_question) { create :fun_question, time_period:, user: user_with_response }
  let!(:fun_question_answer) { create :fun_question_answer, fun_question:, user: user_with_response }
  let(:worker) { RemindCheckInEmailWorker.new }
  let(:run_worker) { worker.run_notification }

  before(:each) do
    stub_const('ENV', ENV.to_hash.merge('DAY_TO_SEND_FINAL_REMINDER' => Date.current.strftime('%A')))
  end

  describe '.initialize' do
    it 'fetches all users' do
      expect(worker.users).to match_array([user_with_response, user_without_response])
    end
    it 'fetch time_period' do
      expect(worker.time_period).to eq(TimePeriod.current)
    end
  end

  describe '#send_remind_email' do
    it 'sends a reminder email to the user' do
      expect(UserEmailMailer).to receive(:auto_remind_checkin).with(user_without_response, time_period).and_call_original
      expect(UserEmailMailer).to_not receive(:auto_remind_checkin).with(user_with_response, time_period).and_call_original

      expect do
        worker.send(:send_reminder_email, user_without_response, time_period)
      end.to change { ActionMailer::Base.deliveries.count }.by(1)

      email = ActionMailer::Base.deliveries.last
      expect(email.to).to include(user_without_response.email)
    end
  end
end
