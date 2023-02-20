require 'rails_helper'

describe NotificationWorkers::EmotionSelectionNotificationWorker do
  let!(:user1) { create :user }
  let!(:user2) { create :user }
  let!(:time_period) { create :time_period }
  let(:worker) { NotificationWorkers::EmotionSelectionNotificationWorker.new }
  let(:run_worker) { worker.run_notification }

  describe '.initialize' do
    it 'fetches all users' do
      expect(worker.users).to match_array([user1, user2])
    end
    it 'fetch time_period' do
      expect(worker.time_period).to eq(time_period)
    end
  end

  describe '.run_notifications' do
    it 'sends email notifications' do
      run_worker
      mail_recipients = ActionMailer::Base.deliveries.collect { |mail| mail.to[0] }
      expect(mail_recipients.count).to eql 2
      expect(mail_recipients).to match_array([user1.email, user2.email])
    end
  end
end
