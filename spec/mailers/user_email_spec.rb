# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserEmailMailer, type: :mailer do
  let(:user) { create(:user) }
  let(:time_period) { create(:time_period) }

  describe '#response_invite' do
    let(:mail) { described_class.response_invite(user, time_period) }

    it 'includes links with token parameter in body' do
      mail.deliver_now

      expect(mail.body.encoded).to include('token=')
    end

    it 'does not include user_id in URL query in body' do
      mail.deliver_now

      expect(mail.body.encoded).not_to include('user_id=')
    end

    it 'does not include time_period_id in URL query in body' do
      mail.deliver_now

      expect(mail.body.encoded).not_to include('time_period_id=')
    end
  end

  describe '#send_reminder' do
    let(:signed_url) { SignedLinks::ResponseFlowBuilder.url(user, TimePeriod.current) }
    let(:mail) { described_class.send_reminder(user, signed_url) }

    it 'includes the given link with token in body' do
      mail.deliver_now

      expect(mail.body.encoded).to include('token=')
    end

    it 'does not include user_id in URL in body' do
      mail.deliver_now

      expect(mail.body.encoded).not_to include('user_id=')
    end
  end

  describe '#reminder_email' do
    let(:response) { create(:response, user: user, time_period: time_period) }
    let(:mail) { described_class.reminder_email(user, response, time_period) }

    it 'includes sign_in link with token in body' do
      mail.deliver_now

      expect(mail.body.encoded).to include('token=')
    end

    it 'does not include user_id in URL in body' do
      mail.deliver_now

      expect(mail.body.encoded).not_to include('user_id=')
    end
  end

  describe '#auto_remind_checkin' do
    let(:mail) { described_class.auto_remind_checkin(user, time_period) }

    it 'includes sign_in link with token in body' do
      mail.deliver_now

      expect(mail.body.encoded).to include('token=')
    end

    it 'does not include user_id in URL in body' do
      mail.deliver_now

      expect(mail.body.encoded).not_to include('user_id=')
    end
  end

  describe '#results_email' do
    let(:fun_question) { create(:fun_question, time_period: time_period) }
    let(:mail) { described_class.results_email(user, time_period, fun_question) }

    it 'includes results link with token in body' do
      mail.deliver_now

      expect(mail.body.encoded).to include('token=')
    end

    it 'does not include user_id or slug in URL in body' do
      mail.deliver_now

      expect(mail.body.encoded).not_to match(/user_id=\d+/)
      expect(mail.body.encoded).not_to include('slug=')
    end
  end

  describe '#daily_timesheet_reminder' do
    let(:missing_periods) { [time_period] }
    let(:mail) { described_class.daily_timesheet_reminder(user, missing_periods) }

    it 'includes direct entry links with token in body' do
      mail.deliver_now

      expect(mail.body.encoded).to include('token=')
    end

    it 'does not include user_id or time_period_id in URL in body' do
      mail.deliver_now

      expect(mail.body.encoded).not_to include('user_id=')
      expect(mail.body.encoded).not_to include('time_period_id=')
    end
  end
end
