ActiveAdmin.register Response do
  permit_params %i[time_period_id emotion_id user_id not_working steps rating productivity bad_follow_comment
                   comment completed_at]

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

  form do |f|
    f.inputs 'Response Details' do
      f.input :emotion, collection: Emotion.emotion_public.map { |e| [e.word, e.id] }
      f.input :user, collection: User.all.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
      f.input :time_period, collection: TimePeriod.all.map { |t| ["#{t.date_range}", t.id] }
      f.input :not_working
      f.input :rating, input_html: { min: 1, max: 5 }
      f.input :productivity, input_html: { min: 0, max: 9 }
      f.input :comment
      f.input :bad_follow_comment
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
