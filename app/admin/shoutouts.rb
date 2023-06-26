ActiveAdmin.register Shoutout do
  permit_params :user, :to_text, :to_full_name, :recipient, :time_period_range, :not_ask, :visible
  actions :index, :edit, :destroy
  index do

    column :id
    column 'Shoutout', :to_text
    column 'Sender', :to_full_name
    column 'Recipients', :recipient
    column :time_period_range
    column :visible
    column :not_ask
    actions
  end

  form do |f|
    f.inputs 'Shoutouts' do
      f.input :visible
      f.input :not_ask
    end
    f.actions
  end

  filter :user, as: :select, collection: User.all.map { |item| [item.to_full_name, item.id] }, label: 'Sender'
  filter :time_period, as: :select, collection: TimePeriod.all.map { |item| [item.date_range, item.id] }
  filter :recipients,  as: :select, collection: User.all.map { |item| [item.to_full_name, item.id] }


end
