require 'rails_helper'
require 'passwordless/test_helpers'

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
  let(:presenter) { Api::V1::ResultsPresenter.new(time_period.slug, user) }

  describe '#render' do
    subject { presenter.json_hash }
    it 'renders a JSON response with the results data' do
      is_expected.to eq(
        {
          time_periods: TimePeriod.ordered,
          emotions: time_period.emotions,
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
          combined_shoutouts: [
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
          ]
        }
      )
    end
  end
end
