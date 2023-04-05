require 'rails_helper'

describe Api::V1::ResponseFlowFromEmail do
  let!(:user) { create :user}
  let!(:time_period) { create :time_period }
  let!(:emotion) { create :emotion }

  subject { Api::V1::ResponseFlowFromEmail.new(params, user).call }

  context 'meme selection response' do
    let!(:params) { { emotion_id: emotion.id, time_period_id: time_period.id, user_id: user.id, last_step: 'meme-selection' } }
    it 'create response' do
      expect { subject }.to change { Response.count }.by(1)
      expect(subject[:success]).to be_truthy
    end

    it 'failed create response without time period' do
      time_period.destroy
      expect { subject }.to change { Response.count }.by(0)
      expect(subject[:success]).to be_falsey
      expect(subject[:error].class).to eq ActiveRecord::RecordInvalid
    end

    it 'failed create response without user' do
      user.destroy
      expect { subject }.to change { Response.count }.by(0)
      expect(subject[:success]).to be_falsey
      expect(subject[:error].class).to eq ActiveRecord::RecordNotSaved
    end

    it 'update response notices' do
      response = FactoryBot.create(:response, user_id: user.id, emotion_id: nil, not_working: true, time_period_id: time_period.id, steps: %w[emotion-selection-web results])
      expect { subject }.to change { response.reload.notices }
      expect(subject[:success]).to be_truthy
    end
  end

  context 'not working response' do
    let!(:params) { { emotion_id: nil, not_working: true, time_period_id: time_period.id, user_id: user.id, last_step: 'results' } }

    it 'create' do
      expect { subject }.to change { Response.count }.by(1)
      expect(subject[:success]).to be_truthy
    end

    it 'return previous response' do
      response = FactoryBot.create(:response, user_id: user.id, emotion_id: emotion.id, time_period_id: time_period.id, steps: %w[emotion-selection-web results])
      expect { subject }.to_not change { response.reload }
      expect(subject[:success]).to be_truthy
    end
  end

  context 'emotion entry response' do
    let!(:params) { { emotion_id: nil, not_working: false, time_period_id: time_period.id, user_id: user.id, last_step: 'emotion-entry' } }
    it 'create response' do
      expect { subject }.to change { Response.count }.by(1)
      expect(subject[:success]).to be_truthy
    end
    it 'update response notices' do
      response = FactoryBot.create(:response, user_id: user.id, emotion_id: nil, not_working: true, time_period_id: time_period.id, steps: %w[emotion-selection-web results])
      expect { subject }.to change { response.reload.notices }
      expect(subject[:success]).to be_truthy
    end
  end
end
