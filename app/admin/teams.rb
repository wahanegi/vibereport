include ActiveAdminHelpers

ActiveAdmin.register Team do
  permit_params :name, user_ids: []

  form do |f|
    f.inputs 'Team Details' do
      f.input :name
      f.input :users, as: :check_boxes, collection: User.order(:email).pluck(:email, :id).map { |email, id| [email, id] }
    end
    f.actions
  end

  filter :name, as: :string, label: 'Team name'
  filter :user_teams_user_id, as: :select, collection: User.order(:email).map { |u| ["#{u.email} (#{u.first_name} #{u.last_name})", u.id] }, label: 'User'

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

        user_emails = if row[:user_emails].nil?
                        []
                      else
                        row[:user_emails].split(',')
                      end

        UserTeam.where(team_id: team.id).destroy_all

        user_emails.each do |email|
          user = User.find_by(email: email.strip.downcase)
          UserTeam.create(user_id: user.id, team_id: team.id) if user
        end
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
    csv_header = ['Name', 'User Emails']

    csv_data = CSV.generate(headers: true) do |csv|
      csv << csv_header

      Team.includes(:users).find_each do |team|
        csv << [team.name, team.users.map(&:email).join(',')]
      end
    end

    send_data csv_data, type: 'text/csv; charset=utf-8; header=present', disposition: 'attachment; filename=teams.csv'
  end

  show do |team|
    attributes_table do
      row :name
      row 'Managers' do
        managers = team.user_teams.managers.map { |ut| ut.user.email }
        if managers.empty?
          'No managers present<br><br>'.html_safe + link_to('Add team managers', admin_team_user_teams_path(team))
        else
          managers_list = managers.sort.join('<br>').html_safe
          managers_list + '<br><br>'.html_safe + link_to('Edit team managers', admin_team_user_teams_path(team))
        end
      end
      row 'Users' do
        if team.users.empty?
          'User List is Empty'
        else
          team.users.map { |user| user.email }.sort.join('<br>').html_safe
        end
      end
      panel 'Select Time Period' do
        form action: admin_team_path(team), method: :get do
          select_tag :time_period,
                     options_from_collection_for_select(TimePeriod.order(end_date: :desc), :id, :date_range, params[:time_period]),
                     include_blank: 'Select Time Period',
                     onchange: 'this.form.submit();'
        end
      end

      time_period = TimePeriod.find_by(id: params[:time_period]) if params[:time_period].present?
      earliest_start_date = TimePeriod.minimum(:start_date)
      latest_end_date = TimePeriod.maximum(:end_date)

      if time_period
        previous_time_period = TimePeriod
                               .joins(responses: { user: :teams })
                               .where('end_date < ?', time_period.start_date)
                               .where(teams: { id: team.id })
                               .where(responses: { not_working: false })
                               .order(end_date: :desc)
                               .first
      end

      vars = ActiveAdminHelpers.time_period_vars(
        team: team,
        time_period: time_period,
        previous_time_period: previous_time_period
      )

      if time_period
        panel "Time Period: <span style='color: #007bff; font-weight: bold;'>#{time_period.date_range}</span>".html_safe do
          responses_count = Response.joins(user: :teams).where(teams: { id: team.id }, time_period: time_period, not_working: false).count
          verbatim_list = vars[:verbatim_list]
          teammate_engagement_count = vars[:teammate_engagement_count]

          if responses_count.zero?
            if verbatim_list.present? && verbatim_list != 'No teammate engagement verbatims present'
              attributes_table_for team do
                row :Teammate_Engagement_Verbatims do
                  if verbatim_list.is_a?(Array)
                    ul class: 'bubble-list' do
                      verbatim_list.each do |comment|
                        next if comment.blank?

                        li class: 'bubble' do
                          span strip_tags(comment)
                        end
                      end
                    end
                  else
                    div verbatim_list
                  end
                end
              end
            else
              div 'No data present for this time period.'
            end
          elsif responses_count.positive?
            formatted_result = vars[:emotion_index][0]
            chart = vars[:emotion_index][1]
            previous_period_emotion_index = vars[:previous_emotion_index]

            productivity_avg = vars[:productivity_avg]
            previous_period_productivity_avg = vars[:previous_productivity_avg]

            participation_percentage = vars[:participation_percentage]
            previous_period_participation_percentage = vars[:previous_participation_percentage]

            productivity_verbatims = vars[:productivity_verbatims]

            celebrate_comments_count = vars[:celebrate_comments_count]
            previous_period_celebrate_comments_count = vars[:previous_celebrate_comments_count]

            celebrate_verbatims = vars[:celebrate_verbatims]

            previous_teammate_engagement_count = vars[:previous_teammate_engagement_count]

            attributes_table_for team do
              row :Emotion_Index do
                if previous_time_period.present?
                  trend_data = trend_direction(previous_period_emotion_index, formatted_result)

                  div do
                    span formatted_result
                    span trend_data[0].html_safe, style: trend_data[1].html_safe
                  end
                else
                  div do
                    span formatted_result
                  end
                end
              end
              row :Emotion_Chart do
                chart
              end

              row :Productivity_Average do
                if previous_time_period.present? && productivity_avg != 'No productivity present'
                  trend_data = trend_direction(previous_period_productivity_avg, productivity_avg)

                  div do
                    span productivity_avg
                    span trend_data[0].html_safe, style: trend_data[1]
                  end
                else
                  div do
                    span productivity_avg
                  end
                end
              end

              row :Participation_Percentage do
                if (previous_time_period.present? && participation_percentage.is_a?(String)) || previous_period_participation_percentage.nil?
                  span participation_percentage
                else
                  trend_data = trend_direction(previous_period_participation_percentage, participation_percentage)
                  div do
                    span participation_percentage
                    span trend_data[0].html_safe, style: trend_data[1]
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
                if (previous_time_period.present? && celebrate_comments_count.is_a?(String)) || previous_period_celebrate_comments_count.nil?
                  span celebrate_comments_count
                else
                  trend_data = trend_direction(previous_period_celebrate_comments_count, celebrate_comments_count)
                  div do
                    span celebrate_comments_count
                    span trend_data[0].html_safe, style: trend_data[1]
                  end
                end
              end

              row :Celebration_Verbatims do
                if celebrate_verbatims.is_a?(Array)
                  ul class: 'bubble-list' do
                    celebrate_verbatims.each do |comment|
                      next if comment.blank?

                      li class: 'bubble' do
                        span strip_tags(comment)
                      end
                    end
                  end
                else
                  div celebrate_verbatims
                end
              end

              row :Teammate_Engagement_Count do
                if (previous_time_period.present? && teammate_engagement_count.is_a?(String)) || previous_teammate_engagement_count.nil?
                  span teammate_engagement_count
                else
                  trend_data = trend_direction(previous_teammate_engagement_count, teammate_engagement_count)
                  div do
                    span teammate_engagement_count
                    span trend_data[0].html_safe, style: trend_data[1]
                  end
                end
              end

              row :Teammate_Engagement_Verbatims do
                if verbatim_list.is_a?(Array)
                  ul class: 'bubble-list' do
                    verbatim_list.each do |comment|
                      next if comment.blank?

                      li class: 'bubble' do
                        span strip_tags(comment)
                      end
                    end
                  end
                else
                  div verbatim_list
                end
              end
            end
          else
            div 'No data present for this time period.'
          end
        end
      else
        panel 'No Time Period Selected' do
          'Please select a time period to view the report.'
        end
      end

      if earliest_start_date.nil? || latest_end_date.nil?
        panel "All Time: <span style='color: #007bff; font-weight: bold;'>No data present for this period</span>".html_safe
      else
        panel "All Time: <span style='color: #007bff; font-weight: bold;'>#{earliest_start_date.strftime('%B %Y')}</span> - <span style='color: #007bff; font-weight: bold;'>#{latest_end_date.strftime('%B %Y')}</span>".html_safe do
          all_time_periods = TimePeriod.all
          responses_count = Response.joins(user: :teams).where(teams: { id: team.id }, time_period: all_time_periods, not_working: false).count

          if responses_count.zero?
            div 'No data present for the all time period.'
          else
            responses_data = vars[:responses_data_all]

            attributes_table_for team do
              row :Emotion_Index do
                span vars[:emotion_index_all][0]
              end
              row :Emotion_Chart do
                vars[:emotion_index_all][1]
              end

              row :Productivity_Average do
                span vars[:productivity_avg_all]
              end

              row :Participation_Percentage do
                span vars[:participation_percentage_all]
              end

              row :Responses_Report do
                raw responses_data[0]
              end

              row :Celebrations_Count do
                vars[:celebrate_comments_count_all]
              end

              row :Teammate_Engagement_Count do
                vars[:teammate_engagement_count_all]
              end
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
        user_ids = permitted_params[:team][:user_ids].compact_blank
        user_ids.each { |user_id| UserTeam.create(user_id: user_id, team_id: @team.id) }
        redirect_to admin_team_path(@team), notice: 'Team was successfully created.'
      else
        render :new
      end
    end
  end
end
