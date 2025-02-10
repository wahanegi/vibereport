include ActiveAdminHelpers

ActiveAdmin.register Team do
  permit_params :name, user_ids: []

  form do |f|
    f.inputs 'Team Details' do
      f.input :name
      f.input :users, as: :check_boxes, collection: User.order(:email).pluck(:email, :id)
    end
    f.actions
  end

  filter :name, as: :string, label: 'Team name'
  filter :user_teams_user_id, as: :select, collection: User.order(:email).map { |u| [u.email_with_full_name, u.id] }, label: 'User'

  action_item :import_csv, only: :index do
    link_to 'Import CSV', import_csv_admin_teams_path
  end

  collection_action :import_csv, method: %i[get post] do
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
          ul do
            team.users.sort_by(&:email).each do |user|
              li user.email
            end
          end
        end
      end
      panel 'Select Month' do
        form action: admin_team_path(team), method: :get do
          time_periods = TimePeriod.joins(responses: { user: :teams })
                                   .select("DISTINCT DATE_TRUNC('month', start_date) as month_start")
                                   .where(responses: { user: { teams: team } })
                                   .order(month_start: :desc)
                                   .map { |tp| [tp.month_start.strftime('%Y-%m'), tp.month_start.strftime('%Y-%m-%d')] }
          select_tag :time_period,
                     options_for_select(time_periods, params[:time_period]),
                     include_blank: 'Select Month',
                     onchange: 'this.form.submit();'
        end
      end

      if params[:time_period].present?
        selected_month = Date.parse(params[:time_period])
        time_periods = TimePeriod.distinct
                                 .joins(responses: { user: :teams })
                                 .where("DATE_TRUNC('month', start_date) = ?", selected_month)
                                 .where(responses: { user: { teams: team } })
        time_period = time_periods.order(:start_date).first
      else
        time_periods = TimePeriod.none
        time_period = nil
      end

      if time_period
        previous_time_periods = TimePeriod.joins(responses: { user: :teams })
                                          .where('end_date < ?', time_period.start_date)
                                          .where(responses: { user: { teams: team } })
                                          .where('responses.not_working = ?', false)
                                          .order(end_date: :desc)
      end

      vars = ActiveAdminHelpers.time_period_vars(
        team: team,
        time_period: time_periods,
        previous_time_period: previous_time_periods
      )

      if time_periods.present?
        panel "Month: <span style='color: #007BFF; font-weight: bold;'>#{selected_month.strftime('%B %Y')}</span>".html_safe do
          responses_count = Response.joins(user: :teams)
                                    .where(teams: { id: team.id }, time_period: time_periods, not_working: false)
                                    .count
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
            formatted_result, chart = vars[:emotion_index]

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
                if previous_time_periods.present?
                  trend, trend_style = trend_direction(previous_period_emotion_index, formatted_result)

                  div do
                    span formatted_result
                    span trend.html_safe, style: trend_style
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
                if previous_time_periods.present? && productivity_avg != 'No productivity present'
                  trend, trend_style = trend_direction(previous_period_productivity_avg, productivity_avg)

                  div do
                    span productivity_avg
                    span trend.html_safe, style: trend_style
                  end
                else
                  div do
                    span productivity_avg
                  end
                end
              end

              row :Participation_Percentage do
                if (previous_time_periods.present? && participation_percentage.is_a?(String)) || previous_period_participation_percentage.nil?
                  span participation_percentage
                else
                  trend, trend_style = trend_direction(previous_period_participation_percentage, participation_percentage)
                  div do
                    span participation_percentage
                    span trend.html_safe, style: trend_style
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
                if (previous_time_periods.present? && celebrate_comments_count.is_a?(String)) || previous_period_celebrate_comments_count.nil?
                  span celebrate_comments_count
                else
                  trend, trend_style = trend_direction(previous_period_celebrate_comments_count, celebrate_comments_count)
                  div do
                    span celebrate_comments_count
                    span trend.html_safe, style: trend_style
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
                if (previous_time_periods.present? && teammate_engagement_count.is_a?(String)) || previous_teammate_engagement_count.nil?
                  span teammate_engagement_count
                else
                  trend, trend_style = trend_direction(previous_teammate_engagement_count, teammate_engagement_count)
                  div do
                    span teammate_engagement_count
                    span trend.html_safe, style: trend_style
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

              row 'Shoutouts Count' do
                total_shoutouts_per_user = time_periods.includes(shoutouts: :user)
                                                       .where(shoutouts: { user_id: team.users.ids })
                                                       .flat_map(&:shoutouts)

                if total_shoutouts_per_user.present?
                  ul class: 'bubble-list' do
                    total_shoutouts_per_user.map { |s| s.user.full_name }
                                            .tally
                                            .each do |full_name, count|
                      li "#{full_name} (#{count})", class: 'bubble'
                    end
                  end
                else
                  div 'No shoutouts available for this month.'
                end
              end
            end
          else
            div 'No data present for this month.'
          end
        end
      else
        panel 'No month selected' do
          'Please select a month to view the report.'
        end
      end

      earliest_start_date = TimePeriod.joins(responses: { user: :teams })
                                      .where(responses: { user: { teams: team } })
                                      .minimum(:start_date)
      latest_end_date = TimePeriod.joins(responses: { user: :teams })
                                  .where(responses: { user: { teams: team } })
                                  .maximum(:end_date)

      if earliest_start_date.nil? || latest_end_date.nil?
        panel "All Time: <span style='color: #007bff; font-weight: bold;'>No data present for this period</span>".html_safe
      else
        panel "All Time: <span style='color: #007bff; font-weight: bold;'>#{earliest_start_date.strftime('%B %Y')}</span> - <span style='color: #007bff; font-weight: bold;'>#{latest_end_date.strftime('%B %Y')}</span>".html_safe do
          responses_count = Response.joins(user: :teams)
                                    .where(user: { teams: team }, not_working: false)
                                    .count

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
