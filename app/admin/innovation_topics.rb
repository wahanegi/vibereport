ActiveAdmin.register InnovationTopic do
  permit_params :innovation_body, :posted, :user_id, :time_period_id

  filter :innovation_body
  filter :user, as: :select, collection: User.admin_select_options
  filter :time_period, as: :select, collection: TimePeriod.ordered.map { |t| [t.date_range, t.id] }
  filter :posted, as: :boolean

  index do
    selectable_column
    id_column
    column :innovation_body do |b|
      span b.short_name, title: b.innovation_body
    end
    column :user
    column :time_period do |t|
      link_to t.time_period.date_range,
              admin_time_period_path(t.time_period) if t.time_period.present?
    end
    column :posted
    column :created_at
    actions
  end

  show title: :display_name do
    attributes_table do
      row :innovation_body
      row :user
      row :time_period do |t|
        link_to t.time_period.date_range,
                admin_time_period_path(t.time_period) if t.time_period.present?
      end
      row :posted
      row :created_at
    end

    panel 'Brainstormings' do
      table_for innovation_topic.innovation_brainstormings do
        column :id
        column :brainstorming_body do |b|
          link_to b.short_name,
                  admin_innovation_brainstorming_path(b),
                  title: b.brainstorming_body if b.present?
        end
        column :user
        column :created_at
      end
    end
  end

  form do |f|
    f.inputs do
      f.input :innovation_body
      f.input :user, collection: User.admin_select_options
      f.input :time_period,
              collection: TimePeriod.ordered.map { |t| [t.date_range, t.id] },
              include_blank: true
      f.input :posted
    end
    f.actions
  end
end
