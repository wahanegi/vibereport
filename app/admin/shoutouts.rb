ActiveAdmin.register Shoutout do
  permit_params :user, :to_text, :full_name, :recipient, :time_period_range, :public
  actions :index, :destroy, :edit, :update

  index do
    column :id
    column 'Shoutout', :to_text
    column 'Sender', :full_name
    column 'Recipients', :recipient
    column :time_period_range
    column :public
    actions
  end

  form do |f|
    f.inputs do
      f.input :public
    end
    f.actions
  end

  filter :user, as: :select, collection: User.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }, label: 'Sender'
  filter :time_period, as: :select, collection: TimePeriod.order(start_date: :desc).map { |t| [t.date_range, t.id] }
  filter :recipients,  as: :select, collection: User.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
  filter :public

  controller do
    def scoped_collection
      Shoutout.not_celebrate
    end
  end
end
