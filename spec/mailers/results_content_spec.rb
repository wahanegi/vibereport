require 'rails_helper'

RSpec.describe ResultsContent do
  let(:user) { create(:user) }
  let(:user2) { create(:user) }
  let!(:user3) { create :user }
  let(:time_period) { create(:time_period) }
  let(:fun_question) { nil }
  let(:team) { create(:team) }

  subject { described_class.new(user, time_period, fun_question) }

  describe '#subject' do
    context 'when user submitted a fun question' do
      let(:fun_question) { create(:fun_question, user:) }
      let!(:fun_question_answer) { create(:fun_question_answer, fun_question:) }

      it 'returns the correct subject' do
        expect(subject.subject).to eq("#{fun_question.fun_question_answers.size} people answered a fun question that you submitted")
      end
    end

    context 'when user received shoutouts' do
      let!(:shoutout) { create(:shoutout, time_period:) }
      let!(:shoutout_recipient) { create(:shoutout_recipient, shoutout:, user:) }

      it 'returns the correct subject' do
        expect(subject.subject).to eq("Hey #{user.first_name}, you received shoutouts!")
      end
    end

    context 'when a teammate received shoutouts' do
      let!(:shoutout) { create :shoutout, time_period:, user:, public: true }
      let!(:shoutout_recipient) { create :shoutout_recipient, shoutout:, user: user2 }
      let!(:shoutout_recipient2) { create :shoutout_recipient, shoutout:, user: user3 }
      let!(:user_team) { create :user_team, user:, team: }
      let!(:user_team2) { create :user_team, user: user2, team: }
      let!(:user_team3) { create :user_team, user: user3, team: }

      it 'returns the correct subject' do
        expect(subject.subject).to eq("One of your teammates received shoutouts!")
      end
    end

    context 'when user did not submit a fun question and did not receive shoutouts' do
      it 'returns the correct subject' do
        expect(subject.subject).to eq("Hey #{user.first_name}, the results are in!")
      end
    end
  end

  describe '#main_header' do
    context 'when user submitted a fun question' do
      let(:fun_question) { create(:fun_question, user:) }
      let!(:fun_question_answer) { create(:fun_question_answer, fun_question:) }

      it 'returns the correct main header' do
        expect(subject.main_header).to eq('See what they said!')
      end
    end

    context 'when user received shoutouts' do
      let!(:shoutout) { create(:shoutout, time_period:) }
      let!(:shoutout_recipient) { create(:shoutout_recipient, shoutout:, user:) }

      it 'returns the correct main header' do
        expect(subject.main_header).to eq('You received shoutouts!')
      end
    end

    context 'when user did not submit a fun question and did not receive shoutouts' do
      it 'returns the correct main header' do
        expect(subject.main_header).to eq('Submissions are in!')
      end
    end
  end

  describe '#sub_header' do
    context 'when user submitted a fun question' do
      let(:fun_question) { create(:fun_question, user:) }
      let!(:fun_question_answer) { create(:fun_question_answer, fun_question:) }

      it 'returns the correct sub-header' do
        expect(subject.sub_header).to eq(fun_question.question_body.to_s)
      end
    end
  end
end
