# == Schema Information
#
# Table name: responses
#
#  id             :bigint           not null, primary key
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  emotion_id     :bigint           not null
#  time_period_id :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_responses_on_emotion_id      (emotion_id)
#  index_responses_on_time_period_id  (time_period_id)
#  index_responses_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (emotion_id => emotions.id)
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Response, type: :model do
  let!(:user) { build :user}
  let!(:time_period) { build :time_period }
  let!(:emotion) { build :emotion }
  let(:response) { FactoryBot.build(:response, user: user, time_period: time_period, emotion: emotion) }

  context 'associations' do
    it 'belongs to user' do
      expect(response).to belong_to(:user)
    end

    it 'belongs to time period' do
      expect(response).to belong_to(:time_period)
    end

    it 'belongs to emotion' do
      expect(response).to belong_to(:emotion)
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

    it 'fails when emotion is absent' do
      response.emotion = nil
      expect(response).to_not be_valid
    end

    it 'fails when user and time period not valid' do
      new_response = FactoryBot.build(:response, user_id: response.user_id, time_period_id: response.time_period_id)
      expect(new_response).not_to be_valid
    end
  end
end
