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

      current_time_periods = TimePeriod.current

      responses_count = Response.joins(user: :teams).where(teams: { id: team.id }, time_period: current_time_periods).count

      if responses_count == 0
        div "No data available for the current period."
      else        
        emotion_index_report = EmotionIndex.new(team, current_time_periods)
        emotion_index = emotion_index_report.generate
        formatted_result = emotion_index[:emotion_index]
        chart = emotion_index[:chart]
        previous_period_emotion_index = 0

        productivity_avg_report = ProductivityAverage.new(team, current_time_periods)
        productivity_avg = productivity_avg_report.generate
        previous_period_productivity_avg = 5

        response_percentage_report = ResponsePercentage.new(team, current_time_periods)
        response_percentage = response_percentage_report.generate
        previous_period_response_percentage = 80

        productivity_verbatims_report = ProductivityVerbatims.new(team, current_time_periods)
        productivity_verbatims = productivity_verbatims_report.generate

        attributes_table_for team do
          row :Emotion_Index do
            trend = previous_period_emotion_index.to_i < formatted_result.to_i ? :up : :down

            div do
              span formatted_result, style: "color: #{trend == :up ? 'green' : 'red'}; font-weight: bold;"
            end
          end
          row :Emotion_Chart do
            chart
          end

          row :Productivity_Average do
            trend = previous_period_productivity_avg.to_f < productivity_avg.to_f ? :up : :down

            div do
              span productivity_avg, style: "color: #{trend == :up ? 'green' : 'red'}; font-weight: bold;"
            end
          end

          row :Response_Percentage do
            if response_percentage.is_a?(String)
              span response_percentage
            else
              trend = previous_period_response_percentage < response_percentage ? :up : :down
          
              div do
                span response_percentage, style: "color: #{trend == :up ? 'green' : 'red'}; font-weight: bold;"
              end
            end
          end

          row :Productivity_Verbatims do
            if productivity_verbatims.is_a?(Array)
              ul class: "bubble-list" do
                productivity_verbatims.each do |comment|
                  li class: "bubble" do
                    span comment
                  end
                end
              end
            else
              div productivity_verbatims
            end
          end
        end
      end
    end

    panel "Monthly" do

      monthly_time_periods = TimePeriod.where(start_date: 1.month.ago.beginning_of_day..Time.current.end_of_day)

      responses_count = Response.joins(user: :teams).where(teams: { id: team.id }, time_period: monthly_time_periods).count

      if responses_count == 0
        div "No data available for the monthly period."
      else
        emotion_index_report = EmotionIndex.new(team, monthly_time_periods)
        emotion_index = emotion_index_report.generate
        formatted_result = emotion_index[:emotion_index]
        chart = emotion_index[:chart]
        previous_period_emotion_index = 0

        productivity_avg_report = ProductivityAverage.new(team, monthly_time_periods)
        productivity_avg = productivity_avg_report.generate
        previous_period_productivity_avg = 5

        response_percentage_report = ResponsePercentage.new(team, monthly_time_periods)
        response_percentage = response_percentage_report.generate
        previous_period_response_percentage = 80

        productivity_verbatims_report = ProductivityVerbatims.new(team, monthly_time_periods)
        productivity_verbatims = productivity_verbatims_report.generate

        attributes_table_for team do
          row :Emotion_Index do
            trend = previous_period_emotion_index.to_i < formatted_result.to_i ? :up : :down
      
            div do
              span formatted_result, style: "color: #{trend == :up ? 'green' : 'red'}; font-weight: bold;"
            end
          end
          row :Emotion_Chart do
            chart
          end

          row :Productivity_Average do
            trend = previous_period_productivity_avg.to_f < productivity_avg.to_f ? :up : :down

            div do
              span productivity_avg, style: "color: #{trend == :up ? 'green' : 'red'}; font-weight: bold;"
            end
          end

          row :Response_Percentage do
            if response_percentage.is_a?(String)
              span response_percentage
            else
              trend = previous_period_response_percentage < response_percentage ? :up : :down
          
              div do
                span response_percentage, style: "color: #{trend == :up ? 'green' : 'red'}; font-weight: bold;"
              end
            end
          end

          row :Productivity_Verbatims do
            if productivity_verbatims.is_a?(Array)
              ul class: "bubble-list" do
                productivity_verbatims.each do |comment|
                  li class: "bubble" do
                    span comment
                  end
                end
              end
            else
              div productivity_verbatims
            end
          end
        end
      end
    end

    panel "All Time" do

      all_time_periods = TimePeriod.pluck(:id)

      responses_count = Response.joins(user: :teams).where(teams: { id: team.id }, time_period: all_time_periods).count

      if responses_count == 0
        div "No data available for the all time period."
      else
        emotion_index_report = EmotionIndex.new(team, all_time_periods)
        emotion_index = emotion_index_report.generate
        formatted_result = emotion_index[:emotion_index]
        chart = emotion_index[:chart]
        previous_period_emotion_index = 0

        productivity_avg_report = ProductivityAverage.new(team, all_time_periods)
        productivity_avg = productivity_avg_report.generate
        previous_period_productivity_avg = 5

        response_percentage_report = ResponsePercentage.new(team, all_time_periods)
        response_percentage = response_percentage_report.generate
        previous_period_response_percentage = 80

        productivity_verbatims_report = ProductivityVerbatims.new(team, all_time_periods)
        productivity_verbatims = productivity_verbatims_report.generate

        responses_report = ResponsesReport.new(team, all_time_periods)
        responses_data = responses_report.generate

        attributes_table_for team do
          row :Emotion_Index do
            trend = previous_period_emotion_index.to_i < formatted_result.to_i ? :up : :down

            div do
              span formatted_result, style: "color: #{trend == :up ? 'green' : 'red'}; font-weight: bold;"
            end
          end
          row :Emotion_Chart do
            chart
          end

          row :Productivity_Average do
            trend = previous_period_productivity_avg.to_f < productivity_avg.to_f ? :up : :down

            div do
              span productivity_avg, style: "color: #{trend == :up ? 'green' : 'red'}; font-weight: bold;"
            end
          end

          row :Response_Percentage do
            if response_percentage.is_a?(String)
              span response_percentage
            else
              trend = previous_period_response_percentage < response_percentage ? :up : :down
          
              div do
                span response_percentage, style: "color: #{trend == :up ? 'green' : 'red'}; font-weight: bold;"
              end
            end
          end

          row :Productivity_Verbatims do
            if productivity_verbatims.is_a?(Array)
              ul class: "bubble-list" do
                productivity_verbatims.each do |comment|
                  li class: "bubble" do
                    span comment
                  end
                end
              end
            else
              div productivity_verbatims
            end
          end

          row :Responses_Report do
            div do
              raw responses_data[:chart]
            end
          end
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
