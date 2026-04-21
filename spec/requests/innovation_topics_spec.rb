require 'rails_helper'

RSpec.describe Api::V1::InnovationTopicsController do
  let!(:user) { create :user }
  let!(:time_period) { create :time_period }
  let!(:innovation_topic) { create(:innovation_topic, user: user, time_period: time_period) }
  let(:invalid_attributes) do
    {
      innovation_topic: {
        innovation_body: '',
        time_period_id: time_period.id
      }
    }
  end

  before(:each) do |test|
    sign_in(user) unless test.metadata[:logged_out]
  end

  describe 'GET #show' do
    it 'returns a success response' do
      get "/api/v1/innovation_topics/#{innovation_topic.id}"
      expect(response).to have_http_status(:success)
    end

    it 'returns the innovation topic as JSON' do
      get "/api/v1/innovation_topics/#{innovation_topic.id}"
      body = response.parsed_body
      expect(body.dig('data', 'id').to_s).to eq(innovation_topic.id.to_s)
      expect(body.dig('data', 'attributes', 'innovation_body')).to eq(innovation_topic.innovation_body)
    end

    context 'when the innovation topic does not exist' do
      it 'returns not_found' do
        get '/api/v1/innovation_topics/0'
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      let(:free_time_period) { create(:time_period) }
      let(:valid_attributes) do
        {
          innovation_topic: {
            innovation_body: Faker::Lorem.sentence,
            time_period_id: free_time_period.id
          }
        }
      end

      subject { post '/api/v1/innovation_topics', params: valid_attributes }

      it 'creates a new innovation topic' do
        expect { subject }.to change(InnovationTopic, :count).by(1)
      end

      it 'renders a JSON response with the new innovation topic' do
        subject
        expect(response).to have_http_status(:created)
        created = InnovationTopic.last
        expect(response.parsed_body.dig('data', 'attributes', 'innovation_body')).to eq(created.innovation_body)
      end

      it 'assigns user_id from current_user' do
        subject
        expect(InnovationTopic.last.user_id).to eq(user.id)
      end
    end

    context 'with invalid parameters' do
      subject { post '/api/v1/innovation_topics', params: invalid_attributes }

      it 'does not create a new innovation topic' do
        expect { subject }.not_to change(InnovationTopic, :count)
      end

      it 'renders a JSON response with errors' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['error']['innovation_body']).to be_present
      end
    end

    context 'when innovation_body already exists' do
      let!(:existing_topic) { create(:innovation_topic, innovation_body: 'Existing Topic') }
      let(:unused_time_period) { create(:time_period) }

      it 'does not create a duplicate topic' do
        expect do
          post '/api/v1/innovation_topics', params: {
            innovation_topic: { innovation_body: 'Existing Topic', time_period_id: unused_time_period.id }
          }
        end.not_to change(InnovationTopic, :count)
      end

      it 'returns 422 with error message' do
        post '/api/v1/innovation_topics', params: {
          innovation_topic: { innovation_body: 'Existing Topic', time_period_id: unused_time_period.id }
        }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['error']['innovation_body']).to include('This topic already exists')
      end

      it 'treats different cases as duplicates' do
        expect do
          post '/api/v1/innovation_topics', params: {
            innovation_topic: { innovation_body: 'existing topic', time_period_id: unused_time_period.id }
          }
        end.not_to change(InnovationTopic, :count)
      end
    end
  end

  describe 'PATCH #update' do
    context 'with valid parameters' do
      subject do
        patch "/api/v1/innovation_topics/#{innovation_topic.id}",
              params: { innovation_topic: { innovation_body: 'Updated topic body' } }
      end

      it 'updates the innovation topic' do
        subject
        expect(innovation_topic.reload.innovation_body).to eq('Updated topic body')
      end

      it 'returns the updated innovation topic as JSON' do
        subject
        expect(response).to have_http_status(:success)
        expect(response.parsed_body.dig('data', 'attributes', 'innovation_body')).to eq('Updated topic body')
      end
    end

    context 'with invalid parameters' do
      subject do
        patch "/api/v1/innovation_topics/#{innovation_topic.id}",
              params: { innovation_topic: { innovation_body: '' } }
      end

      it 'returns unprocessable_entity' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['error']['innovation_body']).to be_present
      end
    end

    context 'when the innovation topic does not exist' do
      it 'returns not_found' do
        patch '/api/v1/innovation_topics/0', params: { innovation_topic: { innovation_body: 'Updated' } }
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when updating another user\'s topic' do
      let(:other_user) { create(:user) }
      let(:other_time_period) { create(:time_period) }
      let!(:other_topic) { create(:innovation_topic, user: other_user, time_period: other_time_period) }

      before { sign_in(user) }

      it 'denies update and returns not_found' do
        patch "/api/v1/innovation_topics/#{other_topic.id}",
              params: { innovation_topic: { innovation_body: 'Updated by another user' } }
        expect(response).to have_http_status(:not_found)
        expect(other_topic.reload.innovation_body).not_to eq('Updated by another user')
      end
    end

    context 'when updating to an existing innovation_body' do
      let!(:another_topic) { create(:innovation_topic, innovation_body: 'Taken Name', user: user) }

      it 'returns 422' do
        patch "/api/v1/innovation_topics/#{innovation_topic.id}",
              params: { innovation_topic: { innovation_body: 'Taken Name' } }
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns error message' do
        patch "/api/v1/innovation_topics/#{innovation_topic.id}",
              params: { innovation_topic: { innovation_body: 'Taken Name' } }
        expect(response.parsed_body['error']['innovation_body']).to include('This topic already exists')
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'when the innovation topic exists' do
      subject { delete "/api/v1/innovation_topics/#{innovation_topic.id}" }

      it 'deletes the innovation topic' do
        expect { subject }.to change(InnovationTopic, :count).by(-1)
      end

      it 'returns no_content' do
        subject
        expect(response).to have_http_status(:no_content)
      end
    end

    context 'when the innovation topic does not exist' do
      it 'returns not_found' do
        delete '/api/v1/innovation_topics/0'
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when destroying another user\'s topic' do
      let(:other_user) { create(:user) }
      let(:other_time_period) { create(:time_period) }
      let!(:other_topic) { create(:innovation_topic, user: other_user, time_period: other_time_period) }

      before { sign_in(user) }

      it 'denies destroy and returns not_found' do
        expect { delete "/api/v1/innovation_topics/#{other_topic.id}" }.not_to change(InnovationTopic, :count)
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'authentication' do
    it 'redirects when not signed in', :logged_out do
      get "/api/v1/innovation_topics/#{innovation_topic.id}"
      expect(response).to have_http_status(:found)
    end
  end
end
