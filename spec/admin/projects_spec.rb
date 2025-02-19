require 'rails_helper'

RSpec.describe 'Admin Projects', type: :request do  
  let!(:admin_user) { create(:admin_user) }
  let!(:active_project) { create(:project) }
  let!(:deleted_project) { create(:project, deleted_at: Time.current) }

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
