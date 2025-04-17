ActiveAdmin.register TimeSheetEntry do
  permit_params :user_id, :project_id, :time_period_id, :total_hours

  csv do
    column('Project Code') { |time_sheet_entry| time_sheet_entry.project.code }
    column('Name') { |time_sheet_entry| time_sheet_entry.user.full_name }
    column('Hours') { |time_sheet_entry| time_sheet_entry.total_hours }
  end

  index do
    selectable_column
    id_column
    column('Week of', :time_period, sortable: 'time_periods.start_date') do |time_sheet_entry|
      time_sheet_entry.time_period.date_range_str
    end
    column('Project code', :project, sortable: 'projects.code') { |time_sheet_entry| time_sheet_entry.project.code }
    column 'Logged Hours', :total_hours, sortable: :total_hours
    column 'Person', :user
    actions
  end

  filter :time_period, as: :select, label: 'Week of', collection: TimePeriod.select(:id, :start_date, :end_date)
                                                                            .ordered
                                                                            .map { |tp| [tp.date_range_str, tp.id] }
  filter :project, as: :select, label: 'Project code', collection: Project.pluck(:code, :id)
  filter :user, as: :select, label: 'Person', collection: User.opt_in.select(:id, :first_name, :last_name).map { |user|
    [user.full_name, user.id]
  }

  form do |f|
    f.inputs do
      f.input :user, as: :select, collection: User.opt_in.select(:id, :first_name, :last_name).map { |user|
        [user.full_name, user.id]
      }, include_blank: false
      f.input :project, as: :select, collection: Project.pluck(:code, :id), include_blank: false
      f.input :time_period, as: :select, collection: TimePeriod.select(:id, :start_date, :end_date).map { |time_period|
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
  end

  controller do
    def scoped_collection
      super.includes(:time_period, :project, :user)
    end

    def csv_filename
      return 'Timesheet Entries.csv' if @time_sheet_entries.empty?

      time_periods = @time_sheet_entries.group_by(&:time_period).keys
      formatted_time_periods = time_periods.map { |tp| "#{tp.date_range_str} #{tp.start_date.year}" }.join(', ')

      "Timesheet Entries #{formatted_time_periods}.csv"
    end
  end
end
