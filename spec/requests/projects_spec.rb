require 'rails_helper'

RSpec.describe Api::V1::ProjectsController, type: :request do
  describe 'POST /api/v1/projects' do
    let(:valid_projects_data) do
      { projects: build_list(:project, 2) }.to_json
    end
    let(:headers) { { 'Content-Type' => 'application/json' } }
    let(:json_response) { response.parsed_body }

    context 'when request is valid' do
      it 'syncs the projects successfully' do
        post '/api/v1/projects', params: valid_projects_data, headers: headers

        expect(response).to have_http_status(:ok)
        expect(json_response['message']).to eq('Projects synchronized successfully!')
        expect(Project.count).to eq(2)
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
        expect do
          post '/api/v1/projects', params: duplicate_projects_data, headers: headers
        end.not_to change(Project, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['error']).to include('Duplicate project codes found')
      end
    end

    context 'when project codes differ only in case' do
      let(:case_sensitive_projects_data) do
        {
          projects: [
            { company: 'Tech Corp', code: 'ABC-123', name: 'Project Alpha' },
            { company: 'Industrial Corp', code: 'abc-123', name: 'Project Beta' }
          ]
        }.to_json
      end

      it 'treats codes as case-insensitive and prevents duplicates' do
        post '/api/v1/projects', params: case_sensitive_projects_data, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['error']).to include('Duplicate project codes found')
      end
    end

    context 'when a project fails to save due to missing required fields' do
      let(:invalid_projects_data) do
        {
          projects: [
            { company: '', code: '2025-TEC-01', name: 'Project Alpha' },
            { company: 'Industrial Corp', code: '2024-IND-02', name: '' }
          ]
        }
      end

      it 'returns an error when required fields are missing' do
        expect do
          post '/api/v1/projects', params: invalid_projects_data.to_json, headers: headers
        end.not_to change(Project, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['error']).to include("Company can't be blank").or include("Name can't be blank")
      end
    end

    context 'when request contains an empty projects array' do
      let(:empty_projects_data) { { projects: [] }.to_json }

      it 'does not change project count and returns success' do
        expect do
          post '/api/v1/projects', params: empty_projects_data, headers: headers
        end.not_to change(Project, :count)

        expect(response).to have_http_status(:ok)
        expect(json_response['message']).to eq('Projects synchronized successfully!')
      end
    end

    context 'when a project already exists in the database' do
      before do
        create(:project, company: 'Tech Corp', code: '2025-TEC-01', name: 'Old Project Name')
      end

      let(:updated_projects_data) do
        {
          projects: [
            { company: 'Tech Corp', code: '2025-TEC-01', name: 'Project Alpha' }
          ]
        }.to_json
      end

      it 'updates the existing project instead of creating a new one' do
        expect do
          post '/api/v1/projects', params: updated_projects_data, headers: headers
        end.not_to change(Project, :count)

        expect(response).to have_http_status(:ok)
        expect(Project.find_by(code: '2025-TEC-01').name).to eq('Project Alpha')
      end
    end

    context 'when a project fails to save due to validation error during sync' do
      let!(:existing_project) { create(:project, company: 'Existing Corp', code: 'EXIST-001', name: 'Existing Project') }

      let(:invalid_projects_data) do
        {
          projects: [
            { company: 'New Corp', code: 'NEW-001', name: 'New Project' },
            { company: '', code: 'NEW-002', name: 'Invalid Project' }
          ]
        }.to_json
      end

      it 'does not persist any changes when a validation error occurs' do
        expect do
          post '/api/v1/projects', params: invalid_projects_data, headers: headers
        end.not_to change(Project, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['error']).to include("Company can't be blank")
        expect(Project.find_by(code: 'EXIST-001').name).to eq('Existing Project')
        expect(Project.find_by(code: 'NEW-001')).to be_nil
      end
    end
  end
end
