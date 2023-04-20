ActiveAdmin.register AnswerFunQuestion do
  belongs_to :fun_question
  actions :all

  permit_params :answer_body, :response_id, :user_id, :fun_question_id, :public

  index do
    selectable_column
    id_column
    column :answer_body
    column :created_at
    actions
  end

  show do |fun_question|
    answer = AnswerFunQuestion.find_by(id: fun_question.id)
    columns do
      column do
        attributes_table do
          row :answer_body
          row :created_at
          row :updated_at
        end
      end
    end
  end

  form do |f|
    f.inputs 'Answers' do
      f.input :user, collection: User.all.map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
      f.input :response, collection: Response.all.map { |response| ["#{response.id}", response.id] }
      f.input :answer_body
    end
    f.actions
  end

  # controller do
  #   def create
  #     # debugger
  #     begin
  #       AnswerFunQuestion.create!(permitted_params[:answer_fun_question])
  #     rescue StandardError => e
  #       error_message = e.message
  #     end
  #
  #     notice_message = error_message ? nil : 'Successfully created!'
  #     redirect_to admin_fun_question_path, notice: notice_message, alert: error_message
  #   end
  # end
end
