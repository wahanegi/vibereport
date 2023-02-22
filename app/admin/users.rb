ActiveAdmin.register User do
  permit_params :first_name, :last_name, :email, :password, :password_confirmation

  index do
    selectable_column
    id_column    
    column :first_name
    column :last_name
    column :email
    column :created_at
    actions
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
      #@user.skip_confirmation_notification! # Disable confirmation email notification
      super
    end

    def update
      # Disable confirmation email notification
      #@user = User.find(params[:id])
      #@user.skip_confirmation_notification!
      super
    end
  end
end
