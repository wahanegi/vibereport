require 'rails_helper'

RSpec.describe Api::V1::ResultsPresenter do
  let!(:user) { create :user }
  let!(:user2) { create :user }
  let!(:time_period) { create :time_period }
  let!(:emotion) { create :emotion }
  let!(:fun_question) { create :fun_question, time_period: }
  let!(:fun_question_answer) { create :fun_question_answer, fun_question:, user: }
  let!(:user_response) { create :response, emotion:, time_period:, user:, fun_question_answer:, steps: %w[emotion-selection-web meme-selection results], gif: {src: 'https://giphy.com/gifs/mls-chicharito-chicha-savor-it-IXKJ943d0GOIV6UMFj', height: 100 }, completed_at: Date.current }
  let!(:user_response2) { create :response, emotion:, time_period:, user: user2, steps: %w[emotion-selection-web meme-selection results], completed_at: Date.current }
  let!(:shoutout) { create :shoutout, time_period:, user: user2 }
  let!(:shoutout2) { create :shoutout, time_period:, user: }
  let!(:shoutout3) { create :shoutout, time_period:, user: user2, public: true }
  let!(:shoutout_recipient) { create :shoutout_recipient, shoutout:, user: }
  let!(:shoutout_recipient2) { create :shoutout_recipient, shoutout: shoutout2, user: user2 }
  let!(:emoji) { create(:emoji, emoji_code: ':open_mouth:', user_id: user.id, emojiable: fun_question_answer) }
  let(:presenter) { Api::V1::ResultsPresenter.new(time_period.slug, user, 'api/v1/result_managers') }
  let!(:team1) { create :team }
  let!(:team2) { create :team }
  let!(:user_team) { create :user_team, user:, team: team1, manager: true }
  let!(:user_team2) { create :user_team, user:, team: team2, manager: true }

  describe '#render' do
    subject { presenter.json_hash }

    before do
      allow(ENV).to receive(:[]).with('START_WEEK_DAY').and_return('tuesday')
      allow(ENV).to receive(:[]).with('DAY_TO_SEND_INVITES').and_return('friday')
      allow(Date.current).to receive(:wday).and_return(6)
    end

    it 'renders a JSON response with the results data' do
      is_expected.to eq(
        {
          emotions: time_period.emotions.to_a,
          gifs: [
            image: user_response.gif,
            emotion: user_response.emotion
          ],
          fun_question: {
            id: fun_question.id,
            question_body: fun_question.question_body,
            user: fun_question.user
          },
          answers: [{
            answer: fun_question_answer,
            user:,
            emojis: [
              emoji_code: emoji.emoji_code,
              emoji_name: emoji.emoji_name,
              users: [user],
              count: 1,
              current_user_emoji: emoji
            ]
          }],
          sent_shoutouts: [
            {
              recipient: user,
              count: 1
            },
            {
              recipient: user2,
              count: 1
            }
          ],
          received_shoutouts: [
            {
              sender: shoutout3.user,
              count: 2
            },
            {
              sender: shoutout2.user,
              count: 1
            }
          ],
          current_user_shoutouts: {
            received: [{
              shoutout:,
              users: [user2],
              emojis: []
            }],
            sent: [{
              shoutout: shoutout2,
              users: [user2],
              emojis: []
            }],
            total_count: time_period.shoutouts.size
          },
          responses_count: time_period.responses.count,
          current_response: user_response,
          current_user: user,
          received_and_public_shoutouts: [
            {
              shoutout:,
              users: [user2],
              emojis: []
            },
            {
              shoutout: shoutout3,
              users: [user2],
              emojis: []
            }
          ],
          prev_results_path: nil,
          teams: [
            {
              id: team1.id,
              name: team1.name,
              emotion_index_all: presenter.emotion_index_all(team1),
              productivity_average_all: presenter.productivity_average_all(team1),
              emotion_index_current_period: presenter.emotion_index_current_period(team1),
              productivity_average_current_period: presenter.productivity_average_current_period(team1),
              previous_emotion_index: presenter.previous_emotion_index(team1),
              previous_productivity_average: presenter.previous_productivity_average(team1),
              no_data_present: false
            },
            {
              id: team2.id,
              name: team2.name,
              emotion_index_all: presenter.emotion_index_all(team2),
              productivity_average_all: presenter.productivity_average_all(team2),
              emotion_index_current_period: presenter.emotion_index_current_period(team2),
              productivity_average_current_period: presenter.productivity_average_current_period(team2),
              previous_emotion_index: presenter.previous_emotion_index(team2),
              previous_productivity_average: presenter.previous_productivity_average(team2),
              no_data_present: false
            }
          ]
        }
      )
    end
  end
end
