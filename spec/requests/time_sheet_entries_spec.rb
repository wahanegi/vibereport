require 'rails_helper'

RSpec.describe 'TimeSheetEntries API', type: :request do
  let!(:user) { create(:user) }
  let!(:project) { create(:project) }
  let!(:time_period) { create(:time_period) }

  let(:valid_params) do
    {
      time_sheet_entry: {
        user_id: user.id,
        project_id: project.id,
        time_period_id: time_period.id,
        total_hours: 8
      }
    }
  end

  describe 'POST /api/v1/time_sheet_entries' do
    context 'with valid parameters' do
      it 'creates a record in the database and returns 201 Created' do
        expect {
          post '/api/v1/time_sheet_entries', params: valid_params
        }.to change(TimeSheetEntry, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['data']).not_to be_empty
      end
    end

    context 'if user_id is missing' do
      it 'returns 404 Not Found' do
        invalid_params = valid_params.deep_merge(time_sheet_entry: { user_id: nil })

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:not_found)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('User not found')
      end
    end

    context 'if total_hours is negative' do
      it 'returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_merge(time_sheet_entry: { total_hours: -1 })

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']).to include('Total hours must be greater than or equal to 0')
      end
    end
  end
end
