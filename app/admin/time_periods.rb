ActiveAdmin.register TimePeriod do
  permit_params  :start_date, :end_date, :due_date

  index do
    selectable_column
    id_column
    column :start_date
    column :end_date
    column :created_at
    column :due_date
    actions
  end
end
