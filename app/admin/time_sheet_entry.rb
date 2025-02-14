ActiveAdmin.register TimeSheetEntry do
  permit_params :user_id, :project_id, :time_period_id, :total_hours

  index do
    selectable_column
    id_column
    column('Week of', :time_period) { |time_sheet_entry| time_sheet_entry.time_period.date_range_str }
    column('Project code', :project) { |time_sheet_entry| time_sheet_entry.project.code }
    column 'Logged Hours', :total_hours
    column 'Person', :user
    actions
  end

  filter :time_period, as: :select, label: 'Week of', collection: TimePeriod.all.map { |time_period| [time_period.date_range_str, time_period.id] }
  filter :project, as: :select, label: 'Project code', collection: Project.all.map { |project| [project.code, project.id] }
  filter :user, as: :select, label: 'Person', collection: User.opt_in.map { |user| [user.full_name, user.id] }

  form do |f|
    f.inputs do
      f.input :user, as: :select, collection: User.opt_in.map { |user| [user.full_name, user.id] }, include_blank: false
      f.input :project, as: :select, collection: Project.all.map { |project| [project.code, project.id] }, include_blank: false
      f.input :time_period, as: :select, collection: TimePeriod.all.map { |time_period|
        [time_period.date_range_str, time_period.id]
      }, include_blank: false
      f.input :total_hours
    end
    f.actions
  end

  show do
    attributes_table do
      row('Week of') { |time_sheet_entry| time_sheet_entry.time_period.date_range_str }
      row('Project code') { |time_sheet_entry| time_sheet_entry.project.code }
      row('Logged Hours') { |time_sheet_entry| time_sheet_entry.total_hours }
      row('Person') { |time_period| time_period.user.full_name }
      row :created_at
      row :updated_at
    end

    active_admin_comments
  end
end
