ActiveAdmin.register Notification do
  permit_params :user, :details, :viewed

  index sortable: :viewed_asc do
    column 'Sender', sortable: :user_id do |notification|
      link_to(notification.user.email, admin_user_path(notification.user)) + "  (#{notification.user.to_full_name})"
    end
    column :details
    column :viewed
    actions
  end

  form do |f|
    f.inputs 'Notifications' do
      f.input :user, collection: User.all.map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
      f.input :details
      f.input :viewed
    end
    f.actions
  end

  filter :user, as: :select, collection: User.all.map { |item| [item.email, item.id] }, label: 'Sender'
  filter :viewed, as: :boolean
end
