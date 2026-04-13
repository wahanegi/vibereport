ActiveAdmin.register Response do
  permit_params %i[time_period_id emotion_id user_id not_working steps rating productivity productivity_comment
                   celebrate_comment comment completed_at gif innovation_topic_id innovation_brainstorming_id]

  index do
    selectable_column
    id_column
    column :time_period do |response|
      response.time_period.date_range
    end
    column :word do |response|
      response.emotion&.word.presence
    end
    column :category do |response|
      response.emotion&.category.presence
    end
    column :not_working
    column :user
    column :productivity
    column :rating
    column :completed_at
    actions
  end

  show do
    attributes_table do
      row :time_period do |t|
        link_to t.time_period.date_range,
                admin_time_period_path(t.time_period) if t.time_period.present?
      end
      row :emotion do |response|
        link_to response.emotion.word, admin_emotion_path(response.emotion) if response.emotion.present?
      end
      row :user
      row :not_working
      row :steps
      row :rating
      row :comment
      row :notices
      row :productivity
      row :productivity_comment
      row :fun_question do |response|
        if response.fun_question.present?
          link_to response.fun_question.question_body,
                  admin_fun_question_path(response.fun_question)
        end
      end
      row :fun_question_answer do |response|
        if response.fun_question_answer.present?
          link_to response.fun_question_answer.answer_body,
                  admin_fun_question_answer_path(response.fun_question_answer)
        end
      end
      row :gif
      row :draft
      row :shoutout
      row :completed_at
      row :celebrate_comment
      row :innovation_topic
      row :innovation_brainstorming
      row :created_at
      row :updated_at
    end
  end

  filter :user, as: :select, collection: proc { User.joins(:responses).distinct.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] } }
  filter :time_period, as: :select, collection: TimePeriod.order(start_date: :desc).map { |t| [t.date_range, t.id] }
  filter :emotion, as: :select, collection: proc { Emotion.pluck(:word, :id) }, label: 'Word'
  filter :emotion_category, as: :select, collection: Emotion.categories, label: 'Emotion Category'
  filter :not_working, as: :boolean, label: 'Not working'

  form do |f|
    f.inputs 'Response Details' do
      f.input :emotion, collection: Emotion.emotion_public.map { |e| [e.word, e.id] }
      f.input :user, collection: User.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
      f.input :time_period, collection: TimePeriod.order(start_date: :desc).map { |t| [t.date_range.to_s, t.id] }
      f.input :not_working
      f.input :rating, input_html: { min: 1, max: 5 }
      f.input :productivity, input_html: { min: 1, max: 9 }
      f.input :celebrate_comment
      f.input :comment
      f.input :productivity_comment
      f.input :gif
      f.input :completed_at, as: :datepicker
    end
    f.actions
  end

  controller do
    def create
      params[:response][:emotion_id] = nil if params[:response][:not_working] == '1'
      params[:response][:steps] = %w[emotion-selection-web].to_s
      begin
        Response.create!(permitted_params[:response])
      rescue StandardError => e
        error_message = e.message
      end

      notice_message = error_message ? nil : 'Successfully created!'
      redirect_to admin_responses_path, notice: notice_message, alert: error_message
    end

    def update
      params[:response][:emotion_id] = nil if params[:response][:not_working] == '1'
      super
    end
  end
end
