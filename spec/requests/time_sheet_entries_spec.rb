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

  before { sign_in(user) }

  describe 'POST /api/v1/time_sheet_entries tests' do
    context 'with valid parameters' do
      it 'creates a record in the database and returns 201 Created' do
        expect do
          post '/api/v1/time_sheet_entries', params: valid_params
        end.to change(TimeSheetEntry, :count).by(1)

        expect(response).to have_http_status(:created)
        json = response.parsed_body
        expect(json['data']).not_to be_empty
      end
    end

    context 'if user_id is missing' do
      it 'returns 404 Not Found' do
        invalid_params = valid_params.deep_merge(time_sheet_entry: { user_id: nil })

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:not_found)
        json = response.parsed_body
        expect(json['error']).to eq('User not found')
      end
    end

    context 'if project_id is missing' do
      it 'returns 404 Not Found' do
        invalid_params = valid_params.deep_merge(time_sheet_entry: { project_id: nil })

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:not_found)
        json = response.parsed_body
        expect(json['error']).to eq('Project not found')
      end
    end

    context 'if time_period_id is missing' do
      it 'returns 404 Not Found' do
        invalid_params = valid_params.deep_merge(time_sheet_entry: { time_period_id: nil })

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:not_found)
        json = response.parsed_body
        expect(json['error']).to eq('Time Period not found')
      end
    end

    context 'if total_hours is missing' do
      it 'возвращает 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_merge(time_sheet_entry: { total_hours: nil })

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        json = response.parsed_body
        expect(json['errors']).to include("Total hours can't be blank")
      end
    end

    context 'if total_hours is negative' do
      it 'returns 422 Unprocessable Entity' do
        invalid_params = valid_params.deep_merge(time_sheet_entry: { total_hours: -1 })

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        json = response.parsed_body
        expect(json['errors']).to include('Total hours must be greater than or equal to 0')
      end
    end

    context 'if a non-existent user_id is passed' do
      it 'возвращает 404 Not Found' do
        invalid_params = valid_params.deep_merge(time_sheet_entry: { user_id: 99_999 })

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:not_found)
        json = response.parsed_body
        expect(json['error']).to eq('User not found')
      end
    end

    context 'if a non-existent project_id is passed' do
      it 'возвращает 404 Not Found' do
        invalid_params = valid_params.deep_merge(time_sheet_entry: { project_id: 99_999 })

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:not_found)
        json = response.parsed_body
        expect(json['error']).to eq('Project not found')
      end
    end

    context 'if a non-existent time_period_id is passed' do
      it 'возвращает 404 Not Found' do
        invalid_params = valid_params.deep_merge(time_sheet_entry: { time_period_id: 99_999 })

        post '/api/v1/time_sheet_entries', params: invalid_params

        expect(response).to have_http_status(:not_found)
        json = response.parsed_body
        expect(json['error']).to eq('Time Period not found')
      end
    end
  end
end
