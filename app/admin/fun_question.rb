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

  filter :user, as: :select, collection: User.all.order(:email).map { |u| ["#{u.first_name} #{u.last_name}", u.id] }
  filter :time_period, as: :select, collection: TimePeriod.all.order(start_date: :desc).map { |t| [t.date_range, t.id] }
  filter :public, as: :boolean
  filter :used, as: :boolean

  form do |f|
    f.inputs 'Fun questions' do
      f.input :user, collection: User.all.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
      f.input :time_period, collection: TimePeriod.all.order(start_date: :desc).map { |t| ["#{t.date_range}", t.id] }
      f.input :question_body
      f.input :public
      f.input :used
    end
    f.actions
  end

  sidebar :fun_question_answers, only: :show do
    link_to 'Go to answers', admin_fun_question_fun_question_answers_path(fun_question)
  end
end
