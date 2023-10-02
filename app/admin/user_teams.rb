ActiveAdmin.register UserTeam do
  belongs_to :team

  permit_params :user_id, :team_id, :manager

  index do
    column :user
    column 'Email' do |ut|
      ut.user.email
    end
    column :manager
    actions
  end


  form do |f|
    f.inputs 'UserTeam' do
      f.input :user, collection: User.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
      f.input :manager, as: :select
    end
    f.actions
  end
end
