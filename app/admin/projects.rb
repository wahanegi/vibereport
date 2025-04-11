ActiveAdmin.register Project do
  permit_params :company, :code, :name, :usage

  filter :company, as: :string
  filter :code, as: :string, label: 'Project code'
  filter :name, as: :string, label: 'Project name'
  filter :usage, as: :select, collection: Project.usages.map { |key, value| [key, value] }, label: 'Usage'
  filter :deleted_at_null, as: :boolean, label: 'Active'

  scope :all
  scope :active, default: true
  scope :deleted

  index do
    selectable_column
    id_column
    column :company
    column :code
    column :name
    column :usage
    column :deleted_at
    actions do |project|
      link_to 'Restore', restore_admin_project_path(project), method: :put, class: 'member_link' if project.deleted?
    end
  end

  show do
    attributes_table do
      row :company
      row :code
      row :name
      row :usage
      row :created_at
      row :updated_at
      row :deleted_at
    end
    div { link_to 'Restore Project', restore_admin_project_path(project), method: :put, class: 'button' } if project.deleted?
  end

  form do |f|
    f.inputs 'Project Details' do
      f.input :company
      f.input :code, label: 'Project code'
      f.input :name, label: 'Project name'
      f.input :usage, as: :select, collection: Project.usages.keys.map { |key|
        [key, key]
      }, label: 'Usage', include_blank: false
    end
    f.actions
  end

  controller do
    def destroy
      project = Project.find(params[:id])
      result = project.destroy
      if result == :soft_deleted
        redirect_to admin_projects_path, notice: 'Project was soft deleted!'
      else
        redirect_to admin_projects_path, notice: 'Project was permanently deleted!'
      end
    end
  end

  member_action :restore, method: :put do
    project = Project.find(params[:id])
    project.update!(deleted_at: nil)
    redirect_to admin_projects_path, notice: 'Project restored!'
  end

  action_item :restore, only: :show do
    link_to 'Restore Project', restore_admin_project_path(project), method: :put if project.deleted?
  end
end
