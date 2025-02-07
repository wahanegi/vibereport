ActiveAdmin.register FunQuestionAnswer do
  permit_params :answer_body, :response_id, :user_id, :fun_question_id

  actions :all, except: [:new]

  index do
    selectable_column
    column 'Question Body' do |fun_question_answer|
      fun_question_answer.fun_question.question_body
    end
    column 'User Name who answered it' do |fun_question_answer|
      user = fun_question_answer.user
      user.full_name.to_s
    end
    column :answer_body
    column :created_at
    actions
  end

  filter :user, as: :select, collection: User.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
  filter :fun_question, as: :select, collection: proc { FunQuestion.pluck(:question_body, :id) }, label: 'Question Body'

  show do
    columns do
      column do
        attributes_table do
          row 'Question Body' do
            fun_question_answer.fun_question.question_body
          end
          row :answer_body
          row :created_at
          row :updated_at
        end
      end
    end
  end

  form do |f|
    f.inputs 'Answers' do
      f.input :user, collection: User.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
      f.input :answer_body
    end
    f.actions
  end

  action_item :export_csv, only: :index do
    link_to 'Export CSV', export_csv_admin_fun_question_answers_path(fun_question_id: params[:fun_question_id])
  end

  collection_action :export_csv do
    csv_header = ['Question', 'User Name who answered it', 'Answer']

    csv_data = CSV.generate(headers: true) do |csv|
      csv << csv_header

      FunQuestionAnswer.includes(fun_question: :user).find_each do |answer|
        user_name = [answer.user.first_name, answer.user.last_name].compact.join(' ')
        csv << [answer.fun_question.question_body, user_name, answer.answer_body]
      end
    end

    send_data csv_data, type: 'text/csv; charset=utf-8; header=present', disposition: 'attachment; filename=fun_question_answers.csv'
  end
end
