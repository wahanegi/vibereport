require 'rails_helper'

RSpec.describe 'Admin Projects', type: :request do  
  let!(:admin_user) { create(:admin_user) }
  let!(:active_project) { create(:project) }
  let!(:deleted_project) { create(:project, deleted_at: Time.current) }
  let!(:project_with_entries) { create(:project) }
  let!(:time_entry) { create(:time_sheet_entry, project: project_with_entries) }

  before do
    sign_in admin_user  
  end

  describe 'Index page' do
    it 'shows only active projects by default' do
      get '/admin/projects'  
      expect(response.body).to include(active_project.name)
      expect(response.body).not_to include(deleted_project.name)
    end

    it 'shows deleted projects in the "Deleted" scope' do
      get '/admin/projects?scope=deleted'  
      expect(response.body).to include(deleted_project.name)
    end
  end

  describe 'Destroying a project' do
    context 'when the project has time sheet entries' do
      it 'soft deletes the project instead of destroying it' do
        delete "/admin/projects/#{project_with_entries.id}"

        expect(response).to redirect_to(admin_projects_path)
        follow_redirect!
        expect(response.body).to include('Project was soft deleted!')
        expect(project_with_entries.reload.deleted_at).not_to be_nil 
      end
    end

    context 'when the project has no time sheet entries' do
      it 'permanently deletes the project' do
        expect do
          delete "/admin/projects/#{active_project.id}"
        end.to change(Project, :count).by(-1)

        expect(response).to redirect_to(admin_projects_path)
        follow_redirect!
        expect(response.body).to include('Project was permanently deleted!')
        expect(Project.find_by(id: active_project.id)).to be_nil 
      end
    end
  end

  describe 'Restoring a project' do
    it 'restores a deleted project' do
      put restore_admin_project_path(deleted_project)  
      expect(response).to redirect_to(admin_projects_path)  
      follow_redirect!  
      expect(response.body).to include('Project restored!')  
      expect(deleted_project.reload.deleted_at).to be_nil  
    end
  end
end
