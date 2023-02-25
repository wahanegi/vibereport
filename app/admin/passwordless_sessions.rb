ActiveAdmin.register Passwordless::Session do
  belongs_to :user
  permit_params :expires_at, :timeout_at, :token, :authenticatable_id, :authenticatable_type, :claimed_at,
                :user_agent, :remote_addr

  index do
    selectable_column
    id_column
    column :expires_at
    column :token
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
          row :token
          row :user_agent
          row :timeout_at
          row :created_at
          row :updated_at
          row 'magic link' do
            link_to send(Passwordless.mounted_as).token_sign_in_url(session.token)
          end
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

  controller do
    def create
      params[:session][:authenticatable_id] = params[:user_id]
      params[:session][:authenticatable_type] = "User"
      params[:session][:user_agent] = request.env["HTTP_USER_AGENT"]
      params[:session][:remote_addr] = request.remote_addr
      params[:session][:token] = Passwordless.token_generator.call(self)
      @session = Passwordless::Session.new(permitted_params[:session])
      super
    end
  end
end
