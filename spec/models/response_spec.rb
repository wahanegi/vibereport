# == Schema Information
#
# Table name: responses
#
#  id                 :bigint           not null, primary key
#  bad_follow_comment :text
#  celebrate_comment  :text
#  comment            :text
#  gif_url            :string
#  not_working        :boolean          default(FALSE)
#  notices            :jsonb
#  productivity       :integer
#  rating             :integer
#  steps              :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  emotion_id         :bigint
#  time_period_id     :bigint           not null
#  user_id            :bigint           not null
#
# Indexes
#
#  index_responses_on_emotion_id                  (emotion_id)
#  index_responses_on_time_period_id              (time_period_id)
#  index_responses_on_user_id                     (user_id)
#  index_responses_on_user_id_and_time_period_id  (user_id,time_period_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (emotion_id => emotions.id)
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Response, type: :model do
  let!(:user) { create :user}
  let!(:time_period) { create :time_period }
  let!(:emotion) { create :emotion }
  let(:response) { FactoryBot.build(:response, user:, time_period:, emotion:, steps: %w[emotion-selection-web]) }
  let(:not_working_response) { FactoryBot.build(:response, :not_working_response, user:, time_period:, emotion: nil, steps: %w[emotion-selection-web]) }

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
end
