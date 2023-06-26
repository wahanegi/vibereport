ActiveAdmin.register Notification do
  permit_params :user, :details
  actions :index, :show, :destroy
  index do
    column :id
    column 'Sender', sortable: :user_id do |notification|
      link_to(notification.user.email, admin_user_path(notification.user)) + "  (#{notification.user.to_full_name})"
    end
    column 'Details', :details
    actions
  end

  filter :user, as: :select, collection: User.all.map { |item| [item.to_full_name, item.id] }, label: 'Sender'
end
