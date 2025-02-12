require 'rails_helper'

RSpec.describe Api::V1::ProjectsController, type: :request do
  describe 'POST /api/v1/projects' do
    let(:valid_projects_data) do
      {
        projects: [
          { company: 'Tech Corp', code: '2025-TEC-01', name: 'Project Alpha' },
          { company: 'Industrial Corp', code: '2024-IND-02', name: 'Project Beta' }
        ]
      }.to_json
    end
    let(:headers) { { 'Content-Type' => 'application/json' } }

    context 'when request is valid' do
      it 'syncs the projects successfully' do
        post '/api/v1/projects', params: valid_projects_data, headers: headers

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body['message']).to eq('Projects synchronized successfully!')
        expect(Project.count).to eq(2)
      end
    end

    context 'when request contains invalid JSON' do
      it 'returns a bad request error' do
        post '/api/v1/projects', params: '{invalid_json:', headers: headers

        expect(response).to have_http_status(:bad_request)
        expect(response.parsed_body['error']).to eq('Invalid JSON format')
      end
    end

    context 'when request contains duplicate codes' do
      let(:duplicate_projects_data) do
        {
          projects: [
            { company: 'Tech Corp', code: '2025-TEC-01', name: 'Project Alpha' },
            { company: 'Industrial Corp', code: '2025-TEC-01', name: 'Project Beta' }
          ]
        }.to_json
      end

      it 'returns an error about duplicate codes' do
        post '/api/v1/projects', params: duplicate_projects_data, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['error']).to include('Duplicate codes in request')
      end
    end

    context 'when a project fails to save due to validation' do
      before do
        allow_any_instance_of(Project).to receive(:save).and_return(false)
        allow_any_instance_of(Project).to receive_message_chain(:errors, :full_messages).and_return(["Company can't be blank"])
      end

      it 'returns an error about the failed save' do
        post '/api/v1/projects', params: valid_projects_data, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['error']).to include("Failed to save project: Company can't be blank")
      end
    end
  end
end
