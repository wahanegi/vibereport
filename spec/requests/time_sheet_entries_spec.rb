require 'rails_helper'

RSpec.describe 'TimeSheetEntries API', type: :request do
  include ActiveSupport::Testing::TimeHelpers

  let!(:user) { create(:user) }
  let!(:other_user) { create(:user) }
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

  describe 'POST /api/v1/time_sheet_entries/upsert' do
    context 'with valid parameters' do
      it 'creates new entries and returns success' do
        post '/api/v1/time_sheet_entries/upsert', params: valid_params

        expect(response).to have_http_status(:ok)
        expect(json_response['data'].size).to eq(2)
        expect(TimeSheetEntry.count).to eq(2)
      end
    end

    context 'with empty time_sheet_entries' do
      it 'returns unprocessable entity' do
        post '/api/v1/time_sheet_entries/upsert', params: { time_sheet_entries: [] }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['error']).to eq('No timesheet entries provided')
      end
    end

    context 'with invalid entry data' do
      it 'returns validation errors' do
        post '/api/v1/time_sheet_entries/upsert', params: {
          time_sheet_entries: [
            { project_id: nil, total_hours: nil }
          ]
        }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to be_an(Array)
      end
    end

    context 'with an existing entry id' do
      let!(:existing_entry) do
        create(:time_sheet_entry, user: user, project: project, time_period: time_period, total_hours: 3)
      end

      it 'updates the existing entry' do
        post '/api/v1/time_sheet_entries/upsert', params: {
          time_sheet_entries: [
            { id: existing_entry.id, project_id: project.id, total_hours: 10 }
          ]
        }

        expect(response).to have_http_status(:ok)
        expect(TimeSheetEntry.find(existing_entry.id).total_hours).to eq(10)
      end
    end

    context 'when id is provided but entry not found for current user' do
      let!(:entry_of_other_user) do
        create(:time_sheet_entry, user: other_user, project: project, time_period: time_period, total_hours: 5)
      end

      it 'returns not found and does not create a new record' do
        post '/api/v1/time_sheet_entries/upsert', params: {
          time_sheet_entries: [
            { id: entry_of_other_user.id, project_id: project.id, total_hours: 10 }
          ]
        }

        expect(response).to have_http_status(:not_found)
        expect(json_response['error']).to eq('Time sheet entry not found')
        expect(TimeSheetEntry.find(entry_of_other_user.id).total_hours).to eq(5)
      end
    end

    context 'when id is provided but entry does not exist' do
      it 'returns not found and does not create a record with supplied id' do
        post '/api/v1/time_sheet_entries/upsert', params: {
          time_sheet_entries: [
            { id: 999_999, project_id: project.id, total_hours: 10 }
          ]
        }

        expect(response).to have_http_status(:not_found)
        expect(json_response['error']).to eq('Time sheet entry not found')
        expect(TimeSheetEntry.exists?(999_999)).to be_falsey
      end
    end

    context 'with direct timesheet session (Save Draft flow)' do
      let!(:team) { create(:team, timesheet_enabled: true) }
      let!(:user_team_record) { create(:user_team, user: user, team: team) }
      let!(:overdue_period) do
        create(:time_period, start_date: 3.weeks.ago.to_date, end_date: 2.weeks.ago.to_date, due_date: 10.days.ago.to_date)
      end
      let(:token) do
        url = SignedLinks::DirectTimesheetEntryBuilder.call(user, overdue_period)
        Rack::Utils.parse_query(URI.parse(url).query)['token']
      end

      before { sign_out(user) }

      it 'does not clear session when final_submit is false (draft)' do
        get '/api/v1/direct_timesheet_entry', params: { token: token }
        post '/api/v1/time_sheet_entries/upsert', params: valid_params.merge(final_submit: false)

        expect(response).to have_http_status(:ok)
        expect(session[:direct_timesheet_time_period_id]).to eq(overdue_period.id)
      end

      it 'clears session when final_submit is true' do
        get '/api/v1/direct_timesheet_entry', params: { token: token }
        post '/api/v1/time_sheet_entries/upsert', params: valid_params.merge(final_submit: true)

        expect(response).to have_http_status(:ok)
        expect(session[:direct_timesheet_time_period_id]).to be_nil
      end

      it 'does not clear session when final_submit is omitted (backward compatibility)' do
        get '/api/v1/direct_timesheet_entry', params: { token: token }
        post '/api/v1/time_sheet_entries/upsert', params: valid_params

        expect(response).to have_http_status(:ok)
        expect(session[:direct_timesheet_time_period_id]).to eq(overdue_period.id)
      end
    end
  end

  describe 'GET /api/v1/direct_timesheet_entry' do
    let!(:team) { create(:team, timesheet_enabled: true) }
    let!(:user_team_record) { create(:user_team, user: user, team: team) }
    let!(:overdue_period) { create(:time_period, start_date: 3.weeks.ago.to_date, end_date: 2.weeks.ago.to_date, due_date: 10.days.ago.to_date) }

    let(:token) do
      url = SignedLinks::DirectTimesheetEntryBuilder.call(user, overdue_period)
      Rack::Utils.parse_query(URI.parse(url).query)['token']
    end

    before { sign_out(user) }

    context 'with a valid token and overdue period' do
      it 'signs in the user and redirects to /app' do
        get '/api/v1/direct_timesheet_entry', params: { token: token }

        expect(response).to redirect_to('/app')
      end

      it 'stores the time_period_id in the session' do
        get '/api/v1/direct_timesheet_entry', params: { token: token }

        expect(session[:direct_timesheet_time_period_id]).to eq(overdue_period.id)
      end
    end

    context 'when token is invalid' do
      it 'redirects to sign in with alert' do
        get '/api/v1/direct_timesheet_entry', params: { token: 'garbage-token' }

        expect(response).to redirect_to(new_user_session_path)
        expect(flash[:alert]).to eq('Invalid or expired link')
      end
    end

    context 'when token is missing' do
      it 'redirects to sign in with alert' do
        get '/api/v1/direct_timesheet_entry'

        expect(response).to redirect_to(new_user_session_path)
        expect(flash[:alert]).to eq('Invalid or expired link')
      end
    end

    context 'when token has expired' do
      it 'redirects to sign in with alert' do
        expired_token = token

        travel(SignedLinks::DirectTimesheetEntryBuilder::TOKEN_TTL + 1.day) do
          get '/api/v1/direct_timesheet_entry', params: { token: expired_token }

          expect(response).to redirect_to(new_user_session_path)
          expect(flash[:alert]).to eq('Invalid or expired link')
        end
      end
    end

    context 'when user does not exist' do
      it 'redirects to sign in with alert' do
        valid_token = token
        user.destroy!

        get '/api/v1/direct_timesheet_entry', params: { token: valid_token }

        expect(response).to redirect_to(new_user_session_path)
        expect(flash[:alert]).to eq('Invalid link')
      end
    end

    context 'when time period does not exist' do
      it 'redirects to sign in with alert' do
        valid_token = token
        overdue_period.destroy!

        get '/api/v1/direct_timesheet_entry', params: { token: valid_token }

        expect(response).to redirect_to(new_user_session_path)
        expect(flash[:alert]).to eq('Invalid link')
      end
    end

    context 'when user has no team with timesheet enabled' do
      before { team.update!(timesheet_enabled: false) }

      it 'redirects to sign in with access denied alert' do
        get '/api/v1/direct_timesheet_entry', params: { token: token }

        expect(response).to redirect_to(new_user_session_path)
        expect(flash[:alert]).to eq('Access denied')
      end
    end

    context 'when time period is not overdue' do
      let!(:future_period) { create(:time_period, start_date: 1.week.from_now.to_date, end_date: 2.weeks.from_now.to_date, due_date: 10.days.from_now.to_date) }

      let(:non_overdue_token) do
        url = SignedLinks::DirectTimesheetEntryBuilder.call(user, future_period)
        Rack::Utils.parse_query(URI.parse(url).query)['token']
      end

      it 'redirects to /app without storing session' do
        get '/api/v1/direct_timesheet_entry', params: { token: non_overdue_token }

        expect(response).to redirect_to('/app')
        expect(session[:direct_timesheet_time_period_id]).to be_nil
      end
    end
  end

  describe 'DELETE /api/v1/time_sheet_entries/:id' do
    let!(:entry1) { create(:time_sheet_entry, user: user, project: project, time_period: time_period, total_hours: 8) }
    let!(:entry2) { create(:time_sheet_entry, user: other_user, project: project2, time_period: time_period, total_hours: 5) }

    context 'when the entry exists and belongs to the current user' do
      before { delete "/api/v1/time_sheet_entries/#{entry1.id}" }

      it 'returns http status no content' do
        expect(response).to have_http_status(:ok)
      end

      it 'deletes the entry' do
        expect(TimeSheetEntry.exists?(entry1.id)).to be_falsey
      end
    end

    context 'when the entry does not exist' do
      before { delete '/api/v1/time_sheet_entries/9999' }

      it 'returns http status not found' do
        expect(response).to have_http_status(:not_found)
      end

      it 'returns an error message' do
        expect(json_response['error']).to eq('Time sheet entry not found')
      end
    end

    context 'when the entry belongs to another user' do
      before { delete "/api/v1/time_sheet_entries/#{entry2.id}" }

      it 'returns http status not found' do
        expect(response).to have_http_status(:not_found)
      end

      it 'returns an error message' do
        expect(json_response['error']).to eq('Time sheet entry not found')
      end

      it 'does not delete the entry' do
        expect(TimeSheetEntry.exists?(entry2.id)).to be_truthy
      end
    end
  end
end
