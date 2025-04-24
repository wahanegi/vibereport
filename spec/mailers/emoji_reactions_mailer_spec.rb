require 'rails_helper'

RSpec.describe EmojiReactionsMailer, type: :mailer do
  let(:author) { create :user }
  let(:url) { 'https://example.com' }
  let(:messages) { ['A shoutout you wrote for Jane Doe received reactions from John Smith.'] }
  let(:time_period) { create :time_period }

  before do
    allow(ENV).to receive(:fetch).with('DOMAIN_URL', nil).and_return(url)
  end

  describe 'emoji_reaction_email' do
    let(:mail) { EmojiReactionsMailer.emoji_reaction_email(author, messages, time_period) }

    it "sends an email to the author's email address" do
      expect(mail.to).to eq([author.email])
    end

    it 'sets the subject to one of the random emoji reaction subjects' do
      possible_subjects = [
        'People are reacting to your shoutouts',
        'Your shoutouts are receiving attention',
        'Someone thinks your shoutouts are awesome',
        'Your shoutouts are being appreciated'
      ]
      expect(possible_subjects).to include(mail.subject)
    end

    it 'assigns the author to the template' do
      expect(mail.body.encoded).to match("#{author.first_name} #{author.last_name}")
    end

    it 'assigns the messages to the template' do
      messages.each do |message|
        expect(mail.body.encoded).to match(message)
      end
    end

    it 'assigns the domain URL to the template' do
      expect(mail.body.encoded).to match(url)
    end

    it 'renders without errors' do
      expect { mail.deliver_now }.not_to raise_error
    end
  end
end
