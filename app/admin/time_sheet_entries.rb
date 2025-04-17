ActiveAdmin.register TimeSheetEntry do
  permit_params :user_id, :project_id, :time_period_id, :total_hours

  config.sort_order = '' # disable default sorting

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
    column 'Logged Hours', :total_hours
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
      super.includes(:project, :user, :time_period).order(project: { code: :asc }, total_hours: :desc)
    end

    def csv_filename
      return 'Timesheet Entries.csv' if @time_sheet_entries.empty?

      time_periods = @time_sheet_entries.map(&:time_period).uniq

      formatted_period = if time_periods.one?
                           "#{time_periods.first.date_range_str} #{time_periods.first.start_date.year}"
                         else
                           Time.zone.today.strftime('%d-%m-%Y')
                         end

      "Timesheet Entries #{formatted_period}.csv"
    end
  end
end
