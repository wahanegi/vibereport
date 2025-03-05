require 'rails_helper'

RSpec.describe 'TimeSheetEntries API', type: :request do
  let!(:user) { create(:user) }
  let!(:project) { create(:project) }
  let!(:project2) { create(:project) }
  let!(:time_period) { create(:time_period) }
  let(:valid_params) do
    {
      time_sheet_entries: [
        { project_id: project.id, total_hours: 8 },
        { project_id: project2.id, total_hours: 5 }
      ]
    }
  end
  let(:json_response) { response.parsed_body }

  before { sign_in(user) }

  describe 'POST /api/v1/time_sheet_entries' do
    context 'with valid parameters' do
      it 'creates records in the database and returns 201 Created' do
        expect do
          post '/api/v1/time_sheet_entries', params: valid_params
        end.to change(TimeSheetEntry, :count).by(2)

        expect(response).to have_http_status(:created)
        expect(json_response).not_to be_empty
      end
    end

    context 'with no timesheet entries provided' do
      it 'returns 422 Unprocessable Entity' do
        post '/api/v1/time_sheet_entries', params: { time_sheet_entries: [] }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['error']).to eq('No timesheet entries provided')
        expect(TimeSheetEntry.count).to eq(0)
      end
    end

    context 'with missing project_id' do
      it 'does not create records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:project_id] = nil

        expect do
          post '/api/v1/time_sheet_entries', params: invalid_params
        end.not_to change(TimeSheetEntry, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include('Project must exist')
      end
    end

    context 'with missing total_hours' do
      it 'does not create records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:total_hours] = nil

        expect do
          post '/api/v1/time_sheet_entries', params: invalid_params
        end.not_to change(TimeSheetEntry, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include("Total hours can't be blank")
      end
    end

    context 'with negative total_hours' do
      it 'does not create records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:total_hours] = -1

        expect do
          post '/api/v1/time_sheet_entries', params: invalid_params
        end.not_to change(TimeSheetEntry, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include('Total hours must be greater than or equal to 0')
      end
    end

    context 'with non-existent project_id' do
      it 'does not create records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:project_id] = 'invalid_id'

        expect do
          post '/api/v1/time_sheet_entries', params: invalid_params
        end.not_to change(TimeSheetEntry, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include('Project must exist')
      end
    end
  end
end
