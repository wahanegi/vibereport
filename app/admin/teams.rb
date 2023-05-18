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

  show do |team|
    attributes_table do
      row :name
      row "Users" do
        if team.users.empty?
          "User List is Empty"
        else
          team.users.map { |user| user.email }.join(", ")
        end
      end
      row "Total Users" do
        team.users.count
      end
    end
  
    panel "Single Time Period" do
      attributes_table_for team do
        current_time_period = TimePeriod.current
        time_period_id = current_time_period.id
  
        responses = Response.joins(user: { teams: :users_teams })
        .where(users_teams: { team_id: team.id }, responses: { time_period_id: time_period_id })
  
        if responses.any?
          row :Emotion_Index do
            positive_emotion_ids = responses.joins(:emotion)
                               .where(emotions: { category: 'positive' })
                               .distinct
                               .pluck(:emotion_id)
            negative_emotion_ids = responses.joins(:emotion)
                               .where(emotions: { category: 'negative' })
                               .distinct
                               .pluck(:emotion_id)
            
            positive_ratings_sum = responses.where(emotion_id: positive_emotion_ids).distinct.sum(:rating)
            negative_ratings_sum = responses.where(emotion_id: negative_emotion_ids).distinct.sum(:rating)
            
            total_responses = team.users.includes(:responses).distinct.count
            
            result = (positive_ratings_sum - negative_ratings_sum) / total_responses.to_f
          end
        
          row :Productivity_Average do
            responses.average(:productivity) || "No productivitys available"
          end
        
          row :Productivity_Verbatims do
            low_productivity_comments = Response.joins(user: :users_teams)
              .where(users_teams: { team_id: team.id })
              .where('productivity <= ?', 2)
              .pluck(:comment)
          
            if low_productivity_comments.empty?
              "No comments available"
            else
              low_productivity_comments.join(", ")
            end
          end
        
          row :Participation_Percentage do
            total_users = team.users.distinct.count
            responding_users = User.joins(:teams, :responses)
                                   .where(teams: {id: team.id}, responses: {time_period_id: time_period_id})
                                   .distinct
                                   .count
            total_users > 0 ? (responding_users.to_f / total_users * 100).round(2) : 0
          end

          row :Total_Responses do
            team.users.joins(:responses).where(responses: { time_period_id: time_period_id }).distinct.count
          end
        else
          span "No response available for the current time period."
        end
      end
    end
  
    panel "Monthly" do
      attributes_table_for team do
        time_period_ids = TimePeriod.where(start_date: 1.month.ago.beginning_of_day..Time.current.end_of_day).ids
        responses = Response.joins(user: { teams: :users_teams })
        .where(users_teams: { team_id: team.id })
        .where(responses: { time_period_id: time_period_ids })
  
        if responses.any?
          row :Emotion_Index do
            positive_emotion_ids = responses.joins(:emotion)
                                            .where(emotions: { category: 'positive' })
                                            .distinct
                                            .pluck(:emotion_id)
            negative_emotion_ids = responses.joins(:emotion)
                                            .where(emotions: { category: 'negative' })
                                            .distinct
                                            .pluck(:emotion_id)
  
            positive_ratings_sum = responses.where(emotion_id: positive_emotion_ids).distinct.sum(:rating)
            negative_ratings_sum = responses.where(emotion_id: negative_emotion_ids).distinct.sum(:rating)
  
            total_responses = team.users.includes(:responses).where(responses: { time_period_id: time_period_ids }).distinct.count
  
            result = (positive_ratings_sum - negative_ratings_sum) / total_responses.to_f
          end
  
          row :Productivity_Average do
            responses.average(:productivity) || "No productivitys available"
          end
  
          row :Productivity_Verbatims do
            low_productivity_comments = Response.joins(user: :users_teams)
              .where(users_teams: { team_id: team.id })
              .where('productivity <= ?', 2)
              .pluck(:comment)
          
            if low_productivity_comments.empty?
              "No comments available"
            else
              low_productivity_comments.join(", ")
            end
          end
  
          row :Response_Percentage do
            total_users = team.users.count
            responding_users = User.joins(:teams, :responses)
                                   .where(teams: { id: team.id }, responses: { time_period_id: time_period_ids })
                                   .distinct
                                   .count
            total_users > 0 ? (responding_users.to_f / total_users * 100).round(2) : 0
          end

          row :Total_Responses do
            team.users.joins(:responses).where(responses: { time_period_id: time_period_ids }).distinct.count
          end
        else
          span "No response available for the current time period."
        end
      end
    end
  
    panel "All Time" do
      attributes_table_for team do
        responses = Response.joins(user: { teams: :users_teams })
                            .where(users_teams: { team_id: team.id })
    
        if responses.any?
          row :Emotion_Index do
            positive_emotion_ids = responses.joins(:emotion)
                                            .where(emotions: { category: 'positive' })
                                            .distinct
                                            .pluck(:emotion_id)
            negative_emotion_ids = responses.joins(:emotion)
                                            .where(emotions: { category: 'negative' })
                                            .distinct
                                            .pluck(:emotion_id)
    
            positive_ratings_sum = responses.where(emotion_id: positive_emotion_ids).distinct.sum(:rating)
            negative_ratings_sum = responses.where(emotion_id: negative_emotion_ids).distinct.sum(:rating)
    
            total_responses = team.users.includes(:responses).distinct.count
    
            result = (positive_ratings_sum - negative_ratings_sum) / total_responses.to_f
          end
    
          row :Productivity_Average do
            responses.average(:productivity) || "No productivitys available"
          end
    
          row :Productivity_Verbatims do
            low_productivity_comments = Response.joins(user: :users_teams)
              .where(users_teams: { team_id: team.id })
              .where('productivity <= ?', 2)
              .pluck(:comment)
          
            if low_productivity_comments.empty?
              "No comments available"
            else
              low_productivity_comments.join(", ")
            end
          end
    
          row :Response_Percentage do
            total_users = team.users.count
            responding_users = User.joins(:teams, :responses)
                                   .where(teams: { id: team.id })
                                   .distinct
                                   .count
            total_users > 0 ? (responding_users.to_f / total_users * 100).round(2) : 0
          end

          row :Total_Responses do
            team.users.joins(:responses).distinct.count
          end
        else
          span "No response available for the current time period."
        end
      end
    end
  
    active_admin_comments
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