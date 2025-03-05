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

  describe 'GET /api/v1/time_sheet_entries' do
    let!(:entry1) { create(:time_sheet_entry, user: user, project: project, time_period: time_period, total_hours: 8) }
    let!(:entry2) { create(:time_sheet_entry, user: user, project: project2, time_period: time_period, total_hours: 5) }

    context 'with existing entries for the current user and time period' do
      before do
        allow(TimePeriod).to receive(:current).and_return(time_period)
        get '/api/v1/time_sheet_entries'
      end

      it 'returns a success response' do
        expect(response).to have_http_status(:ok)
      end

      it 'has correct data size' do
        expect(json_response['data'].length).to eq(2)
      end

      it 'returns proper JSON API format' do
        expect(json_response).to include('data')
        expect(json_response['data'][0]).to include('type', 'id', 'attributes')
        expect(json_response['data'][0]['type']).to eq('time_sheet_entry')
      end

      it 'returns entries for the current user and current time period' do
        expect(json_response['data'][0]['attributes']['user_id']).to eq(user.id)
        expect(json_response['data'][1]['attributes']['user_id']).to eq(user.id)

        expect(json_response['data'][0]['attributes']['project_id']).to eq(project.id)
        expect(json_response['data'][1]['attributes']['project_id']).to eq(project2.id)

        expect(json_response['data'][0]['attributes']['total_hours']).to eq(entry1.total_hours)
        expect(json_response['data'][1]['attributes']['total_hours']).to eq(entry2.total_hours)
      end
    end

    context 'when no entries exist for the current user and time period' do
      it 'returns an empty array' do
        get '/api/v1/time_sheet_entries'

        expect(response).to have_http_status(:ok)
        expect(json_response['data']).to be_an(Array)
        expect(json_response['data']).to be_empty
      end
    end

    context 'when an unexpected error occurs' do
      before do
        allow(TimePeriod).to receive(:current).and_raise(StandardError.new('Something went wrong'))
        get '/api/v1/time_sheet_entries'
      end

      it 'returns a 500 internal server error' do
        expect(response).to have_http_status(:internal_server_error)
      end

      it 'returns error message' do
        expect(json_response['error']).to eq('An unexpected error occurred')
      end
    end
  end

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
