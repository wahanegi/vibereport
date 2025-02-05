ActiveAdmin.register FunQuestion do
  permit_params :question_body, :used, :time_period_id, :user_id, :public

  index do
    selectable_column
    id_column
    column :question_body
    column :used
    column :public
    column :user.name
    column :created_at
    actions
  end

  filter :user, as: :select, collection: User.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
  filter :time_period, as: :select, collection: TimePeriod.order(start_date: :desc).map { |t| [t.date_range, t.id] }
  filter :public, as: :boolean
  filter :used, as: :boolean

  form do |f|
    f.inputs 'Fun questions' do
      f.input :user, collection: User.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
      f.input :time_period, collection: TimePeriod.order(start_date: :desc).map { |t| [t.date_range.to_s, t.id] }
      f.input :question_body
      f.input :public
      f.input :used
    end
    f.actions
  end
end
