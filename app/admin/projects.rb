ActiveAdmin.register Project do
  permit_params :company, :code, :name

  filter :company, as: :string
  filter :code, as: :string, label: 'Project code'
  filter :name, as: :string, label: 'Project name'

  show do
    attributes_table do
      row :company
      row :code
      row :name
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.inputs 'Project Details' do
      f.input :company
      f.input :code, label: 'Project code'
      f.input :name, label: 'Project name'
    end
    f.actions
  end
end
