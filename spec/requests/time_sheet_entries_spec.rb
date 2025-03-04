require 'rails_helper'

RSpec.describe 'TimeSheetEntries API', type: :request do
  let!(:user) { create(:user) }
  let!(:project) { create(:project) }
  let!(:project2) { create(:project) }
  let!(:time_period) { create(:time_period) }
  let(:valid_params) do
    {
      time_sheet_entries: [
        {
          user_id: user.id,
          project_id: project.id,
          time_period_id: time_period.id,
          total_hours: 8
        },
        {
          user_id: user.id,
          project_id: project2.id,
          time_period_id: time_period.id,
          total_hours: 5
        }
      ]
    }
  end
  let(:json_response) { response.parsed_body }

  before { sign_in(user) }

  describe 'POST /api/v1/time_sheet_entries tests' do
    context 'with valid parameters' do
      it 'creates records in the database and returns 201 Created' do
        expect do
          post '/api/v1/time_sheet_entries', params: valid_params
        end.to change(TimeSheetEntry, :count).by(2)

        expect(response).to have_http_status(:created)
        expect(json_response).not_to be_empty
      end
    end

    context 'if user_id is not provided' do
      it 'does not create any records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:user_id] = nil

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include('User must exist')
      end
    end

    context 'if project_id is missing' do
      it 'does not create any records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:project_id] = nil

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include('Project must exist')
      end
    end

    context 'if time_period_id is missing' do
      it 'does not create any records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:time_period_id] = nil

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include('Time period must exist')
      end
    end

    context 'if total_hours is missing' do
      it 'does not create any records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:total_hours] = nil

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include("Total hours can't be blank")
      end
    end

    context 'if total_hours is negative' do
      it 'does not create any records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:total_hours] = -1

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include('Total hours must be greater than or equal to 0')
      end
    end

    context 'if a non-existent user_id is passed' do
      it 'does not create any records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:user_id] = 'invalid_id'

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include('User must exist')
      end
    end

    context 'if a non-existent project_id is passed' do
      it 'does not create any records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:project_id] = 'invalid_id'

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include('Project must exist')
      end
    end

    context 'if a non-existent time_period_id is passed' do
      it 'does not create any records and returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_dup
        invalid_params[:time_sheet_entries][0][:time_period_id] = 'invalid_id'

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include('Time period must exist')
      end
    end
  end
end
