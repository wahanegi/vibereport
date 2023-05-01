require 'rails_helper'

RSpec.describe Api::V1::ResultsPresenter do
  let!(:user) { create :user }
  let!(:time_period) { create :time_period }
  let!(:emotion) { create :emotion }
  let!(:fun_question) { create :fun_question, time_period: }
  let!(:answer_fun_question) { create :answer_fun_question, fun_question:, user: }
  let!(:user_response) { create :response, emotion:, time_period:, user:, fun_question:, steps: %w[emotion-selection-web meme-selection], gif: {src: 'https://giphy.com/gifs/mls-chicharito-chicha-savor-it-IXKJ943d0GOIV6UMFj', height: 100} }
  let(:presenter) { Api::V1::ResultsPresenter.new(time_period.id) }

  describe '#render' do
    subject { presenter.json_hash }
    it 'renders a JSON response with the results data' do
      is_expected.to eq(
        {
          answers: [{
            answer: answer_fun_question,
            user:
          }],
          emotions: time_period.emotions,
          fun_question: {
            question_body: fun_question.question_body,
            user: fun_question.user
          },
          gifs: [user_response.gif],
          time_periods: TimePeriod.ordered
        }
      )
    end
  end
end
