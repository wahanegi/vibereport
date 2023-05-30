ActiveAdmin.register Team do
  permit_params :name, user_ids: []

  form do |f|
    f.inputs 'Team Details' do
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
      row 'Users' do
        if team.users.empty?
          'User List is Empty'
        else
          team.users.map { |user| user.email }.sort.join("<br>").html_safe
        end
      end
    end

    previous_time_periods = TimePeriod.where("end_date < ?", Date.current).order(end_date: :desc).first

    if previous_time_periods.present?

      panel "Time Period: <span style='color: #007bff; font-weight: bold;'>#{previous_time_periods.date_range}</span>".html_safe do   
        responses_count = Response.joins(user: :teams).where(teams: { id: team.id }, time_period: previous_time_periods).count

        if responses_count == 0
          div 'No data available for the previous period.'
        else
          emotion_index_report = EmotionIndex.new(team, previous_time_periods)
          emotion_index = emotion_index_report.generate
          formatted_result = emotion_index[:emotion_index]
          chart = emotion_index[:chart]        
          time_period = TimePeriod.where("end_date < ?", previous_time_periods.start_date).order(end_date: :desc).first
          previous_emotion_index_report = EmotionIndex.new(team, time_period)
          previous_emotion_index = previous_emotion_index_report.generate
          previous_period_emotion_index = previous_emotion_index[:emotion_index]

          productivity_avg_report = ProductivityAverage.new(team, previous_time_periods)
          productivity_avg = productivity_avg_report.generate
          previous_period_productivity_avg_report = ProductivityAverage.new(team, time_period)
          previous_period_productivity_avg = previous_period_productivity_avg_report.generate

          participation_percentage_report = ParticipationPercentage.new(team, previous_time_periods)
          participation_percentage = participation_percentage_report.generate

          previous_period_participation_percentage_report = ParticipationPercentage.new(team, time_period)
          previous_period_participation_percentage = previous_period_participation_percentage_report.generate

          productivity_verbatims_report = ProductivityVerbatims.new(team, previous_time_periods)
          productivity_verbatims = productivity_verbatims_report.generate

          celebrate_comments_count_report = CelebrationsCount.new(team, previous_time_periods)
          celebrate_comments_count = celebrate_comments_count_report.generate

          previous_period_celebrate_comments_count_report = CelebrationsCount.new(team, time_period)
          previous_period_celebrate_comments_count = previous_period_celebrate_comments_count_report.generate

          celebrate_verbatims_report = CelebrationVerbatims.new(team, previous_time_periods)
          celebrate_verbatims = celebrate_verbatims_report.generate

          teammate_engagement_count_report = TeammateEngagementCount.new(team, previous_time_periods)
          teammate_engagement_count = teammate_engagement_count_report.generate

          previous_teammate_engagement_count_report = TeammateEngagementCount.new(team, time_period)
          previous_teammate_engagement_count = previous_teammate_engagement_count_report.generate

          verbatim_list_report = TeammateEngagementVerbatims.new(team, previous_time_periods)
          verbatim_list = verbatim_list_report.generate

          attributes_table_for team do
            row :Emotion_Index do
              trend = previous_period_emotion_index.to_f < formatted_result.to_f ? '&#x2191;' : '&#x2193;'

              div do
                span formatted_result
                span trend.html_safe, style: "color: #{trend == '&#x2191;' ? 'green' : 'red'}; font-size: 20px; font-weight: bold;"
              end
            end
            row :Emotion_Chart do
              chart
            end

            row :Productivity_Average do
              trend = previous_period_productivity_avg.to_f < productivity_avg.to_f ? '&#x2191;' : '&#x2193;'

              div do
                span productivity_avg
                span trend.html_safe, style: "color: #{trend == '&#x2191;' ? 'green' : 'red'}; font-size: 20px; font-weight: bold;"
              end
            end

            row :Participation_Percentage do
              if participation_percentage.is_a?(String)
                span participation_percentage
              else
                trend = previous_period_participation_percentage < participation_percentage ? '&#x2191;' : '&#x2193;'

                div do
                  span participation_percentage
                  span trend.html_safe, style: "color: #{trend == '&#x2191;' ? 'green' : 'red'}; font-size: 20px; font-weight: bold;"
                end
              end
            end

            row :Productivity_Verbatims do
              if productivity_verbatims.is_a?(Array)
                ul class: 'bubble-list' do
                  productivity_verbatims.each do |comment|
                    li class: 'bubble' do
                      span comment
                    end
                  end
                end
              else
                div productivity_verbatims
              end
            end

            row :Celebrations_Count do
              if celebrate_comments_count.is_a?(String)
                span celebrate_comments_count
              else
                trend = previous_period_celebrate_comments_count.to_f < celebrate_comments_count.to_f ? '&#x2191;' : '&#x2193;'

                div do
                  span celebrate_comments_count
                  span trend.html_safe, style: "color: #{trend == '&#x2191;' ? 'green' : 'red'}; font-size: 20px; font-weight: bold;"
                end
              end
            end

            row :Celebration_Verbatims do
              if celebrate_verbatims.is_a?(Array)
                ul class: 'bubble-list' do
                  celebrate_verbatims.each do |comment|
                    unless comment.blank?
                      li class: 'bubble' do
                        span comment.gsub(/\[(.*?)\]\(\d+\)/, '\1')
                      end
                    end
                  end
                end
              else
                div celebrate_verbatims
              end
            end

            row :Teammate_Engagement_Count do
              if teammate_engagement_count.is_a?(String)
                span teammate_engagement_count
              else
                trend = previous_teammate_engagement_count.to_f < teammate_engagement_count.to_f ? '&#x2191;' : '&#x2193;'

                div do
                  span teammate_engagement_count
                  span trend.html_safe, style: "color: #{trend == '&#x2191;' ? 'green' : 'red'}; font-size: 20px; font-weight: bold;"
                end
              end
            end

            row :Teammate_Engagement_Verbatims do
              if verbatim_list.is_a?(Array)
                ul class: 'bubble-list' do
                  verbatim_list.each do |comment|
                    unless comment.blank?
                      li class: 'bubble' do
                        span comment.gsub(/\[(.*?)\]\(\d+\)/, '\1')
                      end
                    end
                  end
                end
              else
                div verbatim_list
              end
            end
          end
        end
      end
    else
      div 'No data available for the previous period.'
    end

    month = Date.today.month
    year = Date.today.year
    start_date = Date.new(year, month, 1)
    end_date = start_date.end_of_month

    panel "Monthly: <span style='color: #007bff; font-weight: bold;'>#{start_date.strftime('%B %Y')}</span>".html_safe do
      monthly_time_periods = TimePeriod.where(start_date: start_date..end_date)
      responses_count = Response.joins(user: :teams).where(teams: { id: team.id }, time_period: monthly_time_periods).count

      if responses_count == 0
        div 'No data available for the monthly period.'
      else
        emotion_index_report = EmotionIndex.new(team, monthly_time_periods)
        emotion_index = emotion_index_report.generate
        formatted_result = emotion_index[:emotion_index]
        chart = emotion_index[:chart]

        productivity_avg_report = ProductivityAverage.new(team, monthly_time_periods)
        productivity_avg = productivity_avg_report.generate

        participation_percentage_report = ParticipationPercentage.new(team, monthly_time_periods)
        participation_percentage = participation_percentage_report.generate

        productivity_verbatims_report = ProductivityVerbatims.new(team, monthly_time_periods)
        productivity_verbatims = productivity_verbatims_report.generate

        celebrate_comments_count_report = CelebrationsCount.new(team, monthly_time_periods)
        celebrate_comments_count = celebrate_comments_count_report.generate

        celebrate_verbatims_report = CelebrationVerbatims.new(team, monthly_time_periods)
        celebrate_verbatims = celebrate_verbatims_report.generate

        teammate_engagement_count_report = TeammateEngagementCount.new(team, monthly_time_periods)
        teammate_engagement_count = teammate_engagement_count_report.generate

        verbatim_list_report = TeammateEngagementVerbatims.new(team, monthly_time_periods)
        verbatim_list = verbatim_list_report.generate

        attributes_table_for team do
          row :Emotion_Index do
            span formatted_result
          end
          row :Emotion_Chart do
            chart
          end

          row :Productivity_Average do
            span productivity_avg
          end

          row :Participation_Percentage do
            span participation_percentage
          end

          row :Productivity_Verbatims do
            if productivity_verbatims.is_a?(Array)
              ul class: 'bubble-list' do
                productivity_verbatims.each do |comment|
                  li class: 'bubble' do
                    span comment
                  end
                end
              end
            else
              div productivity_verbatims
            end
          end

          row :Celebrations_Count do
            celebrate_comments_count
          end

          row :Celebration_Verbatims do
            if celebrate_verbatims.is_a?(Array)
              ul class: 'bubble-list' do
                celebrate_verbatims.each do |comment|
                  unless comment.blank?
                    li class: 'bubble' do
                      span comment.gsub(/\[(.*?)\]\(\d+\)/, '\1')
                    end
                  end
                end
              end
            else
              div celebrate_verbatims
            end
          end

          row :Teammate_Engagement_Count do
            teammate_engagement_count
          end

          row :Teammate_Engagement_Verbatims do
            if verbatim_list.is_a?(Array)
              ul class: 'bubble-list' do
                verbatim_list.each do |comment|
                  unless comment.blank?
                    li class: 'bubble' do
                      span comment.gsub(/\[(.*?)\]\(\d+\)/, '\1')
                    end
                  end
                end
              end
            else
              div verbatim_list
            end
          end
        end
      end
    end

    all_time_periods = TimePeriod.pluck(:id)
    earliest_start_date = TimePeriod.minimum(:start_date)
    latest_end_date = TimePeriod.maximum(:end_date)

    panel "All Time: <span style='color: #007bff; font-weight: bold;'>#{earliest_start_date.strftime('%B %Y')}</span> - <span style='color: #007bff; font-weight: bold;'>#{latest_end_date.strftime('%B %Y')}</span>".html_safe do    

      responses_count = Response.joins(user: :teams).where(teams: { id: team.id }, time_period: all_time_periods).count

      if responses_count == 0
        div 'No data available for the all time period.'
      else
        emotion_index_report = EmotionIndex.new(team, all_time_periods)
        emotion_index = emotion_index_report.generate
        formatted_result = emotion_index[:emotion_index]
        chart = emotion_index[:chart]
        previous_period_emotion_index = 0

        productivity_avg_report = ProductivityAverage.new(team, all_time_periods)
        productivity_avg = productivity_avg_report.generate
        previous_period_productivity_avg = 5

        participation_percentage_report = ParticipationPercentage.new(team, all_time_periods)
        participation_percentage = participation_percentage_report.generate
        previous_period_participation_percentage = 80

        productivity_verbatims_report = ProductivityVerbatims.new(team, all_time_periods)
        productivity_verbatims = productivity_verbatims_report.generate

        responses_report = ResponsesReport.new(team, all_time_periods)
        responses_data = responses_report.generate

        celebrate_comments_count_report = CelebrationsCount.new(team, all_time_periods)
        celebrate_comments_count = celebrate_comments_count_report.generate

        celebrate_verbatims_report = CelebrationVerbatims.new(team, all_time_periods)
        celebrate_verbatims = celebrate_verbatims_report.generate

        teammate_engagement_count_report = TeammateEngagementCount.new(team, all_time_periods)
        teammate_engagement_count = teammate_engagement_count_report.generate

        verbatim_list_report = TeammateEngagementVerbatims.new(team, all_time_periods)
        verbatim_list = verbatim_list_report.generate

        attributes_table_for team do
          row :Emotion_Index do
            span formatted_result
          end
          row :Emotion_Chart do
            chart
          end

          row :Productivity_Average do
            span productivity_avg
          end

          row :Participation_Percentage do
            span participation_percentage
          end

          row :Productivity_Verbatims do
            if productivity_verbatims.is_a?(Array)
              ul class: 'bubble-list' do
                productivity_verbatims.each do |comment|
                  li class: 'bubble' do
                    span comment
                  end
                end
              end
            else
              div productivity_verbatims
            end
          end

          row :Responses_Report do
            raw responses_data[:chart]
          end

          row :Celebrations_Count do
            celebrate_comments_count
          end

          row :Celebration_Verbatims do
            if celebrate_verbatims.is_a?(Array)
              ul class: 'bubble-list' do
                celebrate_verbatims.each do |comment|
                  unless comment.blank?
                    li class: 'bubble' do
                      span comment.gsub(/\[(.*?)\]\(\d+\)/, '\1')
                    end
                  end
                end
              end
            else
              div celebrate_verbatims
            end
          end

          row :Teammate_Engagement_Count do
            teammate_engagement_count
          end

          row :Teammate_Engagement_Verbatims do
            if verbatim_list.is_a?(Array)
              ul class: 'bubble-list' do
                verbatim_list.each do |comment|
                  unless comment.blank?
                    li class: 'bubble' do
                      span comment.gsub(/\[(.*?)\]\(\d+\)/, '\1')
                    end
                  end
                end
              end
            else
              div verbatim_list
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
