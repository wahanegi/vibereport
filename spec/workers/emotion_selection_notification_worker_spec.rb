require 'rails_helper'

describe EmotionSelectionNotificationWorker do
  let!(:user1) { create :user }
  let!(:user2) { create :user }
  let!(:time_period) { create :time_period, start_date: Date.current, end_date: Date.current + 6.days }
  let(:worker) { EmotionSelectionNotificationWorker.new }
  let(:run_worker) { worker.run_notification }
  let!(:emotion_positive) do
    12.times { create(:emotion, category: 'positive', public: true) }
  end
  let!(:emotion_negative) do
    12.times { create(:emotion, category: 'negative', public: true) }
  end

  describe '.initialize' do
    it 'fetches all users' do
      expect(worker.users).to match_array([user1, user2])
    end
    it 'fetch time_period' do
      expect(worker.time_period).to eq(TimePeriod.current)
    end
  end

  describe '.run_notifications' do
    it 'sends email notifications' do
      stub_const('ENV', ENV.to_hash.merge('DAY_TO_SEND_INVITES' => Date.current.strftime('%A')))
      run_worker
      mail_recipients = ActionMailer::Base.deliveries.collect { |mail| mail.to[0] }
      expect(mail_recipients.count).to eql 2
      expect(mail_recipients).to match_array([user1.email, user2.email])
    end
    it 'does`t sends email notifications unless the ENV variable is set on the current day' do
      stub_const('ENV', ENV.to_hash.merge('DAY_TO_SEND_INVITES' => (Date.current + 2).strftime('%A')))
      run_worker
      mail_recipients = ActionMailer::Base.deliveries.collect { |mail| mail.to[0] }
      expect(mail_recipients.count).to eql 0
      expect(mail_recipients).to be_empty
    end
  end
end
