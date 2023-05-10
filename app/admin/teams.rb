ActiveAdmin.register Team do
  permit_params :name, user_ids: []

  form do |f|
    f.inputs "Team Details" do
      f.input :name
      f.input :users, as: :check_boxes, collection: User.all.map { |user| [user.email, user.id] }
    end
    f.actions
  end

  action_item :import_csv, only: :index do
    link_to 'Import CSV', import_csv_admin_teams_path
  end

  collection_action :import_csv, method: [:get, :post] do
    if request.post?
      file = params[:file].tempfile
      options = { header_transformations: [:downcase], col_sep: ',', row_sep: :auto }
      csv_data = SmarterCSV.process(file, options)
  
      csv_data.each do |row|
        team = Team.find_or_create_by(name: row[:name])
        user_emails = row[:user_emails].split(',')
        existing_user_ids = team.users.map(&:id)
  
        user_emails.each do |email|
          user = User.find_by(email: email.strip)
          if user
            UsersTeam.find_or_create_by(user_id: user.id, team_id: team.id)
            existing_user_ids.delete(user.id)
          end
        end
  
        team.users.delete(User.find(existing_user_ids))
  
        team.save
      end
  
      redirect_to admin_teams_path, notice: 'CSV imported successfully!'
    else
      render 'admin/teams/import'
    end
  end

  action_item :export_csv, only: :index do
    link_to 'Export CSV', export_csv_admin_teams_path
  end

  collection_action :export_csv do
    csv_header = ["Name", "User Emails"]

    csv_data = CSV.generate(headers: true) do |csv|
      csv << csv_header

      Team.includes(:users).find_each do |team|
        csv << [team.name, team.users.map(&:email).join(',')]
      end
    end

    send_data csv_data, type: 'text/csv; charset=utf-8; header=present', disposition: "attachment; filename=teams.csv"
  end

  show do
    attributes_table do
      row :name
      row "Users" do |team|
        team.users.map { |user| user.email }.join(", ")
      end
    end
  end

  controller do
    def create
      @team = Team.new(permitted_params[:team].except(:user_ids))
      
      if @team.save
        user_ids = permitted_params[:team][:user_ids].reject(&:blank?)
        user_ids.each { |user_id| UsersTeam.create(user_id: user_id, team_id: @team.id) }
        redirect_to admin_team_path(@team), notice: 'Team was successfully created.'
      else
        render :new
      end
    end
  end
end