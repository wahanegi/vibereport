require 'rails_helper'

describe Api::V1::ResponseNotWorkingFromEmail do
  let!(:user) { create :user }
  let!(:time_period) { create :time_period }
  let!(:params) { { time_period_id: time_period.id, user_id: user.id, not_working: true } }

  subject { Api::V1::ResponseNotWorkingFromEmail.new(params, user).call }

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
end
