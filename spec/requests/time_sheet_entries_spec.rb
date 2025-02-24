require 'rails_helper'

RSpec.describe 'TimeSheetEntries API', type: :request do
  let!(:user) { create(:user) }
  let!(:project) { create(:project) }
  let!(:time_period) { create(:time_period) }

  let(:valid_params) do
    { time_sheet_entry: attributes_for(:time_sheet_entry, user_id: user.id, project_id: project.id, time_period_id: time_period.id) }
  end

  before { sign_in(user) }

  describe 'POST time_sheet_entries ' do
    subject { post '/api/v1/time_sheet_entries', params: params }

    context 'with valid parameters' do
      let(:params) { valid_params }

      it 'creates a record in the database and returns 201 Created' do
        expect { subject }.to change(TimeSheetEntry, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when required parameters are missing' do
      shared_examples 'missing parameter' do |param, error_message|
        let(:params) { valid_params.deep_merge(time_sheet_entry: { param => nil }) }

        it "returns 404 Not Found if #{param} is missing" do
          subject
          expect(response).to have_http_status(:not_found)
          expect(JSON.parse(response.body)['error']).to eq(error_message)
        end
      end

      it_behaves_like 'missing parameter', :user_id, 'User not found'
      it_behaves_like 'missing parameter', :project_id, 'Project not found'
      it_behaves_like 'missing parameter', :time_period_id, 'Time Period not found'
    end

    context 'when total_hours is invalid' do
      let(:params) { valid_params.deep_merge(time_sheet_entry: { total_hours: -1 }) }

      it 'returns 422 Unprocessable Entity' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['errors']).to include('Total hours must be greater than or equal to 0')
      end
    end

    context 'when an invalid user_id is provided' do
      let(:params) { valid_params.deep_merge(time_sheet_entry: { user_id: 99999 }) }

      it 'returns 404 Not Found' do
        subject
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq('User not found')
      end
    end
  end
end
