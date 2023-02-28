ActiveAdmin.register Response do
  permit_params :time_period_id, :emotion_id, :user_id

  index do
    selectable_column
    id_column
    column :time_period do |response|
      response.time_period.date_range
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
      f.input :time_period, collection: TimePeriod.all.map { |t| ["#{t.date_range}", t.id] }
    end
    f.actions
  end
end
