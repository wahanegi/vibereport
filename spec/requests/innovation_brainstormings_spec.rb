require 'rails_helper'

RSpec.describe Api::V1::InnovationBrainstormingsController do
  let!(:user) { create :user }
  let!(:innovation_topic) { create(:innovation_topic, user: user) }
  let(:valid_attributes) do
    {
      innovation_brainstorming: {
        innovation_topic_id: innovation_topic.id,
        brainstorming_body: Faker::Lorem.sentence
      }
    }
  end
  let(:invalid_attributes) do
    {
      innovation_brainstorming: {
        innovation_topic_id: innovation_topic.id,
        brainstorming_body: ''
      }
    }
  end

  before(:each) do |test|
    sign_in(user) unless test.metadata[:logged_out]
  end

  describe 'GET #show' do
    let!(:innovation_brainstorming) { create(:innovation_brainstorming, user: user, innovation_topic: innovation_topic) }

    it 'returns a success response' do
      get "/api/v1/innovation_brainstormings/#{innovation_brainstorming.id}"
      expect(response).to have_http_status(:success)
    end

    it 'returns the innovation brainstorming as JSON' do
      get "/api/v1/innovation_brainstormings/#{innovation_brainstorming.id}"
      body = response.parsed_body
      expect(body.dig('data', 'attributes', 'id')).to eq(innovation_brainstorming.id)
      expect(body.dig('data', 'attributes', 'brainstorming_body')).to eq(innovation_brainstorming.brainstorming_body)
    end

    context 'when the innovation brainstorming does not exist' do
      it 'returns not_found' do
        get '/api/v1/innovation_brainstormings/0'
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      subject { post '/api/v1/innovation_brainstormings', params: valid_attributes }

      it 'creates a new innovation brainstorming' do
        expect { subject }.to change(InnovationBrainstorming, :count).by(1)
      end

      it 'assigns user_id from current_user' do
        subject
        expect(InnovationBrainstorming.last.user_id).to eq(user.id)
      end

      it 'renders a JSON response with the new innovation brainstorming' do
        subject
        expect(response).to have_http_status(:created)
        created = InnovationBrainstorming.last
        expect(response.parsed_body.dig('data', 'attributes', 'brainstorming_body')).to eq(created.brainstorming_body)
      end
    end

    context 'with invalid parameters' do
      subject { post '/api/v1/innovation_brainstormings', params: invalid_attributes }

      it 'does not create a new innovation brainstorming' do
        expect { subject }.not_to change(InnovationBrainstorming, :count)
      end

      it 'renders a JSON response with errors' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['error']['brainstorming_body']).to be_present
      end
    end

    context 'when user already submitted for this topic' do
      before { create(:innovation_brainstorming, user: user, innovation_topic: innovation_topic) }

      it 'does not create a duplicate and returns errors' do
        post '/api/v1/innovation_brainstormings', params: valid_attributes
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['error']).to be_present
        expect(InnovationBrainstorming.count).to eq(1)
      end
    end
  end

  describe 'PATCH #update' do
    let!(:innovation_brainstorming) { create(:innovation_brainstorming, user: user, innovation_topic: innovation_topic) }

    context 'with valid parameters' do
      subject do
        patch "/api/v1/innovation_brainstormings/#{innovation_brainstorming.id}",
              params: { innovation_brainstorming: { brainstorming_body: 'Updated brainstorming body' } }
      end

      it 'updates the innovation brainstorming' do
        subject
        expect(innovation_brainstorming.reload.brainstorming_body).to eq('Updated brainstorming body')
      end

      it 'returns the updated innovation brainstorming as JSON' do
        subject
        expect(response).to have_http_status(:success)
        expect(response.parsed_body.dig('data', 'attributes', 'brainstorming_body')).to eq('Updated brainstorming body')
      end
    end

    context 'with invalid parameters' do
      subject do
        patch "/api/v1/innovation_brainstormings/#{innovation_brainstorming.id}",
              params: { innovation_brainstorming: { brainstorming_body: '' } }
      end

      it 'returns unprocessable_entity' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['error']['brainstorming_body']).to be_present
      end
    end

    context 'when the innovation brainstorming does not exist' do
      it 'returns not_found' do
        patch '/api/v1/innovation_brainstormings/0',
              params: { innovation_brainstorming: { brainstorming_body: 'Updated' } }
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:innovation_brainstorming) { create(:innovation_brainstorming, user: user, innovation_topic: innovation_topic) }

    context 'when the innovation brainstorming exists' do
      subject { delete "/api/v1/innovation_brainstormings/#{innovation_brainstorming.id}" }

      it 'deletes the innovation brainstorming' do
        expect { subject }.to change(InnovationBrainstorming, :count).by(-1)
      end

      it 'returns no_content' do
        subject
        expect(response).to have_http_status(:no_content)
      end
    end

    context 'when the innovation brainstorming does not exist' do
      it 'returns not_found' do
        delete '/api/v1/innovation_brainstormings/0'
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'authentication' do
    let!(:innovation_brainstorming) { create(:innovation_brainstorming, user: user, innovation_topic: innovation_topic) }

    it 'redirects when not signed in', :logged_out do
      get "/api/v1/innovation_brainstormings/#{innovation_brainstorming.id}"
      expect(response).to have_http_status(:found)
    end
  end
end
