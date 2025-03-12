require 'rails_helper'
require 'csv'

RSpec.describe 'Admin::Teams', type: :request do
  let(:admin_user) { create(:admin_user) }

  before do
    sign_in admin_user
  end

  describe 'create' do
    it 'creates a new team with users' do
      user1 = create(:user)
      user2 = create(:user)

      post admin_teams_path, params: {
        team: {
          name: 'New Team',
          user_ids: [user1.id, user2.id]
        }
      }

      expect(response).to redirect_to(admin_team_path(Team.last))
      follow_redirect!

      expect(response.body).to include('Team was successfully created.')
      expect(response.body).to include('New Team')
      expect(response.body).to include(user1.email)
      expect(response.body).to include(user2.email)
    end
  end

  describe 'delete team' do
    let!(:team) { create(:team) }

    it 'deletes the team' do
      expect do
        delete admin_team_path(team)
      end.to change(Team, :count).by(-1)
    end

    it 'redirects to the teams' do
      delete admin_team_path(team)
      expect(response).to redirect_to(admin_teams_path)
      follow_redirect!

      expect(response.body).to include('Team was successfully destroyed.')
    end

    it 'removes associated user_teams' do
      user1 = create(:user)
      user2 = create(:user)
      UserTeam.create(user: user1, team: team)
      UserTeam.create(user: user2, team: team)

      expect do
        delete admin_team_path(team)
      end.to change(UserTeam, :count).by(-2)
    end
  end

  describe 'CSV import' do
    it 'imports teams and users from a CSV file' do
      user1 = create(:user)
      user2 = create(:user)

      csv_data = CSV.generate(headers: true) do |csv|
        csv << ['Name', 'User Emails']
        csv << ['Team 1', "#{user1.email}, #{user2.email}"]
      end

      file = Tempfile.new(['import', '.csv'])
      file.write(csv_data)
      file.rewind

      post import_csv_process_admin_teams_path, params: { file: Rack::Test::UploadedFile.new(file.path, 'text/csv') }

      expect(response).to redirect_to(admin_teams_path)
      follow_redirect!

      expect(response.body).to include('CSV imported successfully!')
      expect(response.body).to include('Team 1')
    end

    it 'renders an error message if the CSV file is not attached' do
      post import_csv_process_admin_teams_path, params: { file: nil }
      follow_redirect!
      expect(response.body).to include('Please click &quot;Choose File&quot; and then select a CSV file to upload')
    end

    it 'renders an error message if the CSV file is invalid' do
      file = Tempfile.new(['invalid_import', '.csv'])
      file.write('')
      file.rewind

      post import_csv_process_admin_teams_path, params: { file: Rack::Test::UploadedFile.new(file.path, 'text/csv') }
      follow_redirect!
      expect(response.body).to include('Error importing CSV file')
    end
  end

  describe 'CSV export' do
    it 'exports teams and users to a CSV file' do
      team = create(:team)
      user1 = create(:user)
      user2 = create(:user)
      UserTeam.create(user: user1, team: team)
      UserTeam.create(user: user2, team: team)

      get export_csv_admin_teams_path

      expect(response.headers['Content-Disposition']).to eq('attachment; filename=teams.csv')

      csv = CSV.parse(response.body, headers: true)
      expect(csv.length).to eq(1)
      expect(csv.headers).to match_array(['Name', 'User Emails'])
      expect(csv[0]['Name']).to eq(team.name)
      expect(csv[0]['User Emails']).to eq("#{user1.email},#{user2.email}")
    end
  end
end
