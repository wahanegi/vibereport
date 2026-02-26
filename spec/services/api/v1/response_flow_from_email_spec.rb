require 'rails_helper'

describe Api::V1::ResponseFlowFromEmail do
  let!(:user) { create :user }
  let!(:time_period) { create :time_period }
  let!(:emotion) { create :emotion }

  # New interface: user + explicit payload args (no params)
  def build_service(opts = {})
    defaults = {
      time_period_id: time_period.id,
      emotion_id: opts.fetch(:emotion_id, emotion.id),
      last_step: opts.fetch(:last_step, 'meme-selection'),
      not_working: opts.fetch(:not_working, false),
      completed_at: opts[:completed_at]
    }
    Api::V1::ResponseFlowFromEmail.new(user, **defaults)
  end

  subject { build_service(service_options).call }

  let(:service_options) { {} }

  context 'meme selection response' do
    let(:service_options) { { emotion_id: emotion.id, last_step: 'meme-selection' } }

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

    context 'when existing response has not_working and last_step is not results' do
      let(:service_options) { { emotion_id: nil, not_working: true, last_step: 'meme-selection' } }

      it 'update response notices' do
        response = FactoryBot.create(:response, user_id: user.id, emotion_id: nil, not_working: true, time_period_id: time_period.id, steps: %w[emotion-selection-web results])
        expect { subject }.to change { response.reload.notices }
        expect(subject[:success]).to be_truthy
      end
    end
  end

  context 'not working response' do
    let(:service_options) { { emotion_id: nil, not_working: true, last_step: 'results' } }

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
    let(:service_options) { { emotion_id: nil, not_working: false, last_step: 'emotion-entry' } }

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
