ActiveAdmin.register Emotion do
  permit_params :word, :category

  index do
    selectable_column
    id_column    
    column :word
    column :category
    column :created_at
    actions
  end
end
