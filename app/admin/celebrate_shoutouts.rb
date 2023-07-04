ActiveAdmin.register CelebrateShoutout do
  permit_params :user, :to_text, :full_name, :recipient, :time_period_range
  actions :index, :destroy

  index do
    column :id
    column 'Celebrate Shoutout', :to_text
    column 'Sender', :full_name
    column 'Recipients', :recipient
    column :time_period_range
    actions
  end

  filter :user, as: :select, collection: User.all.map { |item| [item.full_name, item.id] }, label: 'Sender'
  filter :time_period, as: :select, collection: TimePeriod.all.map { |item| [item.date_range, item.id] }
  filter :recipients,  as: :select, collection: User.all.map { |item| [item.full_name, item.id] }
end
