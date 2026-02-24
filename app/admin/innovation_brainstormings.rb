ActiveAdmin.register InnovationBrainstorming do
  permit_params :brainstorming_body, :user_id, :innovation_topic_id

  actions :all, except: [:new]

  filter :brainstorming_body
  filter :innovation_topic
  filter :user

  index do
    selectable_column
    id_column
    column :brainstorming_body do |b|
      span b.short_name, title: b.brainstorming_body
    end
    column :innovation_topic do |t|
      link_to t.innovation_topic.short_name,
              admin_innovation_topic_path(t.innovation_topic),
              title: t.innovation_topic.innovation_body if t.innovation_topic.present?
    end
    column :user
    column :created_at
    actions
  end

  show title: :display_name do
    attributes_table do
      row :brainstorming_body
      row :innovation_topic do |t|
        link_to t.innovation_topic.short_name,
                admin_innovation_topic_path(t.innovation_topic),
                title: t.innovation_topic.innovation_body if t.innovation_topic.present?
      end
      row :user
      row :created_at
    end
  end

  form do |f|
    f.inputs do
      f.input :user, collection: User.admin_select_options
      f.input :innovation_topic,
              as: :select,
              collection: InnovationTopic.ordered,
              member_label: proc { |t| t.short_name }
      f.input :brainstorming_body
    end
    f.actions
  end
end
