ActiveAdmin.register User do
  permit_params :first_name, :last_name, :email, :password

  index do
    selectable_column
    id_column    
    column :first_name
    column :last_name
    column :email
    column :created_at
    column 'Passwordless Sessions' do |user|
      user.passwordless_sessions.size
    end
    actions
  end
  show do |user|
    columns do
      column do
        attributes_table do
          row :email
          row :first_name
          row :last_name
          row :opt_out
          row :created_at
          row :updated_at
        end
      end
    end
  end

  sidebar :passwordless_sessions, only: :show do
    link_to "Go to sessions", admin_user_passwordless_sessions_path(user)
  end

  
  form do |f|
    f.inputs do      
      f.input :first_name
      f.input :last_name
      f.input :email
    end
    f.actions
  end

  controller do
    def create
      params[:user][:password] = Devise.friendly_token[6, 10]
      @user = User.new(permitted_params[:user])
      super
    end
  end
end
