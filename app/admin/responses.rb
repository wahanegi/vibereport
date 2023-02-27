ActiveAdmin.register Response do
  permit_params :time_period_id, :emotion_id, :user_id

  index do
    selectable_column
    id_column
    column :start_date do |response|
      response.time_period.start_date
    end
    column :end_date do |response|
      response.time_period.end_date
    end
    column :word do |response|
      response.emotion.word
    end
    column :category do |response|
      response.emotion.category
    end
    column :user
    column :created_at
    actions
  end

  form do |f|
    f.inputs 'Response Details' do
      f.input :emotion, collection: Emotion.all.map { |e| [e.word, e.id] }
      f.input :user, collection: User.all.map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
      f.input :time_period, collection: TimePeriod.all.map { |t| ["#{t.start_date} - #{t.end_date}", t.id] }
    end
    f.actions
  end
end
