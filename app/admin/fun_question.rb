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

  form do |f|
    f.inputs 'Fun questions' do
      f.input :user, collection: User.all.map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
      f.input :time_period, collection: TimePeriod.all.map { |t| ["#{t.date_range}", t.id] }
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