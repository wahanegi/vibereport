# == Schema Information
#
# Table name: responses
#
#  id                     :bigint           not null, primary key
#  celebrate_comment      :string
#  comment                :text
#  completed_at           :date
#  draft                  :boolean          default(FALSE), not null
#  gif                    :jsonb
#  not_working            :boolean          default(FALSE)
#  notices                :jsonb
#  productivity           :integer
#  productivity_comment   :text
#  rating                 :integer
#  steps                  :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  emotion_id             :bigint
#  fun_question_answer_id :bigint
#  fun_question_id        :bigint
#  shoutout_id            :bigint
#  time_period_id         :bigint           not null
#  user_id                :bigint           not null
#
# Indexes
#
#  index_responses_on_emotion_id                  (emotion_id)
#  index_responses_on_fun_question_answer_id      (fun_question_answer_id)
#  index_responses_on_fun_question_id             (fun_question_id)
#  index_responses_on_shoutout_id                 (shoutout_id)
#  index_responses_on_time_period_id              (time_period_id)
#  index_responses_on_user_id                     (user_id)
#  index_responses_on_user_id_and_time_period_id  (user_id,time_period_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (emotion_id => emotions.id)
#  fk_rails_...  (fun_question_answer_id => fun_question_answers.id)
#  fk_rails_...  (fun_question_id => fun_questions.id)
#  fk_rails_...  (shoutout_id => shoutouts.id)
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Response, type: :model do
  let!(:user) { create :user }
  let!(:time_period) { create :time_period }
  let!(:emotion) { create :emotion }
  let!(:emotion2) { create :emotion }
  let(:response) { FactoryBot.create(:response, user:, time_period:, emotion:, steps: %w[emotion-selection-web]) }
  let!(:fun_question) { create :fun_question }
  let!(:fun_question_answer) { create :fun_question_answer }
  let(:response) { FactoryBot.create(:response, user:, time_period:, emotion:, steps: %w[emotion-selection-web]) }
  let(:not_working_response) { FactoryBot.build(:response, :not_working_response, user:, time_period:, emotion: nil, steps: %w[emotion-selection-web]) }
  let(:completed_response) { create(:response, not_working: false, completed_at: Time.now) }

  context 'associations' do
    it 'belongs to user' do
      expect(response).to belong_to(:user)
    end

    it 'belongs to time period' do
      expect(response).to belong_to(:time_period)
    end

    it 'belongs to emotion' do
      expect(response).to belong_to(:emotion).optional
    end

    it 'belongs to fun question' do
      expect(response).to belong_to(:fun_question).optional
    end

    it 'belongs to answer fun question' do
      expect(response).to belong_to(:fun_question_answer).optional
    end
  end

  context 'validations' do
    it 'is valid when valid attributes' do
      expect(response).to be_valid
    end

    it 'fails when user is absent' do
      response.user = nil
      expect(response).to_not be_valid
    end

    it 'fails when time period is absent' do
      response.time_period = nil
      expect(response).to_not be_valid
    end

    it 'when emotion is absent' do
      response.emotion = nil
      expect(response).to be_valid
    end

    it 'fails when user and time period not valid' do
      new_response = FactoryBot.build(:response, user_id: response.user_id, time_period_id: response.time_period_id)
      expect(new_response).not_to be_valid
    end

    it 'valid when emotion is absent for not worked user' do
      expect(not_working_response).to be_valid
    end

    it 'valid value of productivity when step "productivity-bad-follow-up"' do
      response.steps << 'productivity-bad-follow-up'
      response.productivity = 5
      expect(response).to be_valid

      response.productivity = 'invalid'
      expect(response).to_not be_valid

      response.productivity = 10
      expect(response).to_not be_valid
    end
  end

  context 'Scopes' do
    it 'working scope' do
      expect(Response.working).to match_array([completed_response])
    end
    it 'completed scope' do
      expect(Response.completed).to match_array([completed_response])
    end

    describe 'unique_responses scope' do
      let!(:response1) { FactoryBot.create(:response, gif: { src: 'unique_src' }, time_period:, emotion:) }
      let!(:response2) { FactoryBot.create(:response, gif: { src: 'unique_src' }, time_period:, emotion: emotion2) }
      let!(:response3) { FactoryBot.create(:response, gif: { src: 'unique_src' }, time_period:, emotion:) }
      let!(:response4) { FactoryBot.create(:response, gif: { src: 'different_src' }, time_period:, emotion:) }

      it 'returns only unique responses based on gif src and emotion_id' do
        unique_responses = Response.unique_responses.reload

        expect(unique_responses).to include(response1)
        expect(unique_responses).to include(response2)
        expect(unique_responses).to_not include(response3)
        expect(unique_responses).to include(response4)
      end
    end
  end
end
