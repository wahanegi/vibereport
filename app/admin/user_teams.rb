ActiveAdmin.register UserTeam do
  belongs_to :team

  permit_params :user_id, :team_id, :role

  index do
    column :user
    column 'Email' do |ut|
      ut.user.email
    end
    column :role
    actions
  end


  form do |f|
    f.inputs 'UserTeam' do
      f.input :user, collection: User.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }
      f.input :role, as: :select
    end
    f.actions
  end
end
