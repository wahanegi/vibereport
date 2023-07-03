ActiveAdmin.register Shoutout do
  permit_params :user, :to_text, :to_full_name, :recipient, :time_period_range
  actions :index, :destroy

  index do
    column :id
    column 'Shoutout', :to_text
    column 'Sender', :to_full_name
    column 'Recipients', :recipient
    column :time_period_range
    actions
  end

  filter :user, as: :select, collection: User.all.map { |item| [item.to_full_name, item.id] }, label: 'Sender'
  filter :time_period, as: :select, collection: TimePeriod.all.map { |item| [item.date_range, item.id] }
  filter :recipients,  as: :select, collection: User.all.map { |item| [item.to_full_name, item.id] }

  controller do
    def scoped_collection
      Shoutout.not_celebrate
    end
  end
end
