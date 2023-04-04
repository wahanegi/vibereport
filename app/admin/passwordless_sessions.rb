ActiveAdmin.register Passwordless::Session do
  belongs_to :user
  actions :all, except: :new

  permit_params :expires_at, :timeout_at, :authenticatable_id, :authenticatable_type,
                :claimed_at, :user_agent, :remote_addr

  index do
    selectable_column
    id_column
    column :expires_at
    column :created_at
    actions
  end

  show do |session|
    user = User.find_by(id: session.authenticatable_id)
    columns do
      column do
        attributes_table do
          row 'User email' do
            user.email
          end
          row :expires_at
          row :claimed_at
          row :user_agent
          row :timeout_at
          row :created_at
          row :updated_at
        end
      end
    end
  end

  form do |f|
    f.inputs 'Session' do
      f.input :expires_at, as: :datepicker
    end
    f.actions
  end
end
