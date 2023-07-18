ActiveAdmin.register FunQuestionAnswer do
  belongs_to :fun_question
  actions :all

  permit_params :answer_body, :response_id, :user_id, :fun_question_id

  index do
    selectable_column
    id_column
    column :answer_body
    column :created_at
    actions
  end

  filter :user, as: :select, collection: User.all.order(:email).map { |u| ["#{u.first_name} #{u.last_name}", u.id] }
  filter :fun_question, as: :select, collection: proc { FunQuestion.pluck(:question_body, :id) }, label: 'Question Body'

  show do |fun_question|
    answer = FunQuestionAnswer.find_by(id: fun_question.id)
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
      f.input :user, collection: User.all.order(:email).map { |u| ["#{u.first_name} #{u.last_name}", u.id] }
      f.input :answer_body
    end
    f.actions
  end
end
