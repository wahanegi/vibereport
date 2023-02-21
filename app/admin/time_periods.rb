ActiveAdmin.register TimePeriod do
  permit_params :end_date, :start_date

  index do
    selectable_column
    id_column    
    column :end_date
    column :start_date
    column :created_at
    actions
  end
end
