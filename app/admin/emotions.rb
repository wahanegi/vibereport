ActiveAdmin.register Emotion do
  permit_params :word, :category, :public

  index do
    selectable_column
    id_column
    column :word
    column :category
    column :created_at
    column :public
    actions
  end
end
