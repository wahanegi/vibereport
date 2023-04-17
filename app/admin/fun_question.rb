ActiveAdmin.register FunQuestion do
  permit_params :question_body, :used, :response_id, :user_id

  index do
    selectable_column
    id_column
    column :question_body
    column :used
    column :created_at
    actions
  end

  sidebar :answer_fun_questions, only: :show do
    link_to 'Go to answers',  admin_fun_question_answer_fun_questions_path(fun_question)
  end
end
