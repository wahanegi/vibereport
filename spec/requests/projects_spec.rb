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

    context 'when syncing projects' do
      let!(:project_without_entries) { create(:project) }
      let!(:project_with_entries) { create(:project) }
      let!(:time_entry) { create(:time_sheet_entry, project: project_with_entries) }
      let!(:deleted_project) { create(:project, deleted_at: Time.current) }

      let(:sync_data) do
        {
          projects: [
            { company: deleted_project.company, code: deleted_project.code, name: deleted_project.name }
          ]
        }.to_json
      end

      it 'removes projects with no time sheet entries, marks others as deleted, and restores re-added projects' do
        expect do
          post '/api/v1/projects', params: sync_data, headers: headers
        end.to change(Project, :count).by(-1)

        expect(Project.find_by(id: project_without_entries.id)).to be_nil, "Expected project_without_entries to be deleted"
        expect(project_with_entries.reload.deleted_at).not_to be_nil, "Expected project_with_entries to be soft deleted"
        expect(deleted_project.reload.deleted_at).to be_nil, "Expected deleted_project to be restored"
      end
    end
    
    context 'TIMESHEET_PROJECT_SYNC_AUTH_KEY is set in ENV' do
      let(:auth_key) { 'test_sync_key' }
      let(:valid_payload) do
        {
          projects: [
            { company: 'Company A', code: 'PRJ-001', name: 'Project Alpha' },
            { company: 'Company B', code: 'PRJ-002', name: 'Project Beta' }
          ]
        }.to_json
      end
          
      before do
        ENV['TIMESHEET_PROJECT_SYNC_AUTH_KEY'] = auth_key
        Rails.application.reload_routes!
      end

      after do
        ENV.delete('TIMESHEET_PROJECT_SYNC_AUTH_KEY')
        Rails.application.reload_routes!
      end

      it 'syncs projects successfully when auth_key is correct' do
        post "/api/v1/projects/#{auth_key}", params: valid_payload, headers: headers

        expect(response).to have_http_status(:ok)
        expect(json_response['message']).to eq('Projects synchronized successfully!')
      end
    end
  end

  describe 'GET /api/v1/projects' do
    let!(:project1) { create(:project, code: '2025-XYZ-02') }
    let!(:project2) { create(:project, code: '2020-ABC-02') }
    let(:json_response) { response.parsed_body }

    before { get '/api/v1/projects' }

    it 'returns a success response' do
      expect(response).to have_http_status(:success)
    end

    it 'has correct data size' do
      expect(json_response['data'].length).to eq(2)
    end

    it 'returns proper JSON API format' do
      expect(json_response).to include('data')
      expect(json_response['data'][0]).to include('type', 'id', 'attributes')
      expect(json_response['data'][0]['type']).to eq('project')
    end

    it 'returns a list of projects sorted by code' do
      expect(json_response['data'][0]['attributes']['code']).to eq('2020-ABC-02')
      expect(json_response['data'][1]['attributes']['code']).to eq('2025-XYZ-02')

      expect(json_response['data'][0]['attributes']['name']).to eq(project2.name)
      expect(json_response['data'][1]['attributes']['name']).to eq(project1.name)

      expect(json_response['data'][0]['attributes']['company']).to eq(project2.company)
      expect(json_response['data'][1]['attributes']['company']).to eq(project1.company)
    end

    context 'when no projects exist' do
      before do
        Project.destroy_all
        get '/api/v1/projects'
      end

      it 'returns an empty list' do
        expect(json_response['data']).to be_empty
      end
    end
  end
end
