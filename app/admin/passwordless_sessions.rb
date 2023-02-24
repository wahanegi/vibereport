ActiveAdmin.register_page 'Passwordless Sessions' do
  belongs_to :user

  page_action :update, method: :post do
    session = User.find_by(id: params[:user_id]).passwordless_sessions.find_by(id: params[:id])
    session.update(expires_at: params[:expires_at])
    redirect_to admin_user_path(params[:user_id])
  end

  content do
    session = User.find_by(id: params[:user_id]).passwordless_sessions.find_by(id: params[:format])
    form action: "passwordless_sessions/update", method: :post do |f|
      columns do
        panel 'Update expires_at field' do
          f.input :id, type: :hidden, value: session.id, name: 'id'
          f.input :user_id, type: :hidden, value: params[:user_id], name: 'user_id'
          f.input :expires_at, as: :datepicker, value: session.expires_at.to_date, name: 'expires_at', datepicker_options: { dateFormat: "mm/dd/yy" }
          f.input :authenticity_token, type: :hidden, name: :authenticity_token, value: form_authenticity_token
          f.input :submit, type: :submit
        end
      end
    end
  end
end
