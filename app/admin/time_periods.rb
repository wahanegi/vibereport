ActiveAdmin.register TimePeriod do
  permit_params :end_date, :start_date, :due_date

  index do
    selectable_column
    id_column
    column :start_date
    column :end_date
    column :created_at
    column :due_date
    column :slug
    actions
  end

  form do |f|
    f.inputs do
      f.input :start_date, as: :datepicker
      f.input :end_date, as: :datepicker
      f.input :due_date, as: :datepicker
    end
    f.actions
  end
end
