ActiveAdmin.register Shoutout do
  permit_params :user, :to_text, :full_name, :recipient, :time_period_range
  actions :index, :destroy

  index do
    column :id
    column 'Shoutout', :to_text
    column 'Sender', :full_name
    column 'Recipients', :recipient
    column :time_period_range
    actions
  end

  filter :user, as: :select, collection: User.order(:email).map { |u| ["#{u.first_name} #{u.last_name}", u.id] }, label: 'Sender'
  filter :time_period, as: :select, collection: TimePeriod.all.order(start_date: :desc).map { |t| [t.date_range, t.id] }
  filter :recipients,  as: :select, collection: User.all.order(:email).map { |r| [r.full_name, r.id] }

  controller do
    def scoped_collection
      Shoutout.not_celebrate
    end
  end
end
