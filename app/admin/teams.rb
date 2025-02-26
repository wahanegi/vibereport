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
  filter :user_teams_user_id,
         as: :select,
         collection: User.order(:email)
                         .pluck(Arel.sql("first_name || ' ' || last_name || ' (' || email || ')'"), :id),
         label: 'User'

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

        user_emails = row[:user_emails]&.split(',') || []

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
          time_periods = TimePeriod.with_responses_by_team(team)
                                   .select("DISTINCT DATE_TRUNC('month', start_date) as month_start")
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
        time_periods = TimePeriod.with_responses_by_team(team)
                                 .where("DATE_TRUNC('month', start_date) = ?", selected_month)
                                 .distinct
        time_period = time_periods.order(:start_date).first
      else
        time_periods = TimePeriod.none
        time_period = nil
      end

      if time_period
        previous_time_periods = TimePeriod.with_responses_by_team(team)
                                          .where('end_date < ?', time_period.start_date)
                                          .where('responses.not_working = ?', false)
                                          .order(end_date: :desc)
      end

      vars = ActiveAdminHelpers.time_period_vars(
        team: team,
        time_period: time_periods,
        previous_time_period: previous_time_periods,
        only: %i[
          emotion_index
          previous_emotion_index
          productivity_avg
          previous_productivity_avg
          participation_percentage
          previous_participation_percentage
          productivity_verbatims
          teammate_engagement_count
          previous_teammate_engagement_count
          celebrate_verbatims
          verbatim_list
          emotion_index_all
          productivity_avg_all
          participation_percentage_all
          celebrate_comments_count_all
          teammate_engagement_count_all
          responses_data_all
          shoutout_user_names
          previous_shoutouts_count
        ]
      )

      if time_periods.present?
        panel "Month: <span style='color: #007BFF; font-weight: bold;'>#{selected_month.strftime('%B %Y')}</span>".html_safe do
          responses_count = Response.joins(user: :teams)
                                    .where(teams: { id: team.id }, time_period: time_periods, not_working: false)
                                    .count
          verbatim_list = vars[:verbatim_list]

          if responses_count.zero?

            if verbatim_list.present? && verbatim_list != 'No teammate engagement verbatims present'
              attributes_table_for team do
                row :Teammate_Engagement_Verbatims do
                  if verbatim_list.is_a?(Array)
                    ul class: 'bubble-list' do
                      verbatim_list.compact_blank.each do |comment|
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
              div 'No data present for this month.'
            end
          elsif responses_count.positive?
            emotion_index_formatted_result, emotion_index_chart = vars[:emotion_index]

            previous_period_emotion_index_formatted_result, = vars[:previous_emotion_index]

            productivity_avg = vars[:productivity_avg]
            previous_period_productivity_avg = vars[:previous_productivity_avg]

            participation_percentage = vars[:participation_percentage]
            previous_period_participation_percentage = vars[:previous_participation_percentage]

            productivity_verbatims = vars[:productivity_verbatims]

            teammate_engagement_count = vars[:teammate_engagement_count]
            previous_teammate_engagement_count = vars[:previous_teammate_engagement_count]

            celebrate_verbatims = vars[:celebrate_verbatims]

            shoutout_user_names = vars[:shoutout_user_names]

            shoutouts_count = shoutout_user_names.values.sum
            previous_shoutouts_count = vars[:previous_shoutouts_count]

            attributes_table_for team do
              row :Emotion_Index do
                if previous_time_periods.present?
                  trend, trend_style = trend_direction(previous_period_emotion_index_formatted_result,
                                                       emotion_index_formatted_result)

                  div do
                    span emotion_index_formatted_result
                    span trend.html_safe, style: trend_style
                  end
                else
                  div do
                    span emotion_index_formatted_result
                  end
                end
              end

              row :Emotion_Chart do
                emotion_index_chart
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

              row :Celebration_Verbatims do
                if celebrate_verbatims.is_a?(Array)

                  celebrate_verbatims.compact_blank!

                  ul class: 'bubble-list', id: 'celebration-list' do
                    celebrate_verbatims.each_with_index do |comment, index|
                      li class: "bubble #{index > (VISIBLE_BUBBLES - 1) ? 'display-none' : ''}" do
                        span strip_tags(comment)
                      end
                    end
                  end

                  if celebrate_verbatims.size > VISIBLE_BUBBLES
                    button 'More', class: 'margin-top-1',
                                   onclick: "showMore(event, \"celebration-list\", #{VISIBLE_BUBBLES});"
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

              row :Shoutouts do
                if verbatim_list.is_a?(Array)

                  verbatim_list.compact_blank!

                  ul class: 'bubble-list', id: 'teammate-engagement-list' do
                    verbatim_list.each_with_index do |comment, index|
                      li class: "bubble #{index > (VISIBLE_BUBBLES - 1) ? 'display-none' : ''}" do
                        span strip_tags(comment)
                      end
                    end
                  end

                  if verbatim_list.size > VISIBLE_BUBBLES
                    button 'More', class: 'margin-top-1',
                                   onclick: "showMore(event, \"teammate-engagement-list\", #{VISIBLE_BUBBLES});"
                  end
                else
                  div verbatim_list
                end
              end

              row :Shoutouts_Per_Person do
                if shoutout_user_names.present?
                  ul class: 'bubble-list' do
                    shoutout_user_names.each do |full_name, count|
                      li "#{full_name} (#{count})", class: 'bubble'
                    end
                  end
                else
                  div 'No shoutouts per person available for this month.'
                end
              end

              row :Shoutouts_Count do
                if shoutouts_count.nil? || previous_shoutouts_count.nil?
                  span 'No total shoutouts available for this month.'
                else
                  trend, trend_style = trend_direction(previous_shoutouts_count, shoutouts_count)

                  div do
                    span shoutouts_count
                    span trend.html_safe, style: trend_style
                  end
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

      earliest_start_date, latest_end_date = TimePeriod.with_responses_by_team(team)
                                                       .pick(Arel.sql('MIN(start_date), MAX(end_date)'))

      if earliest_start_date.nil? || latest_end_date.nil?
        panel "All Time: <span style='color: #007bff; font-weight: bold;'>No data present for this period</span>".html_safe
      else
        panel "All Time: <span style='color: #007bff; font-weight: bold;'>#{earliest_start_date.strftime('%B %Y')}</span> - <span style='color: #007bff; font-weight: bold;'>#{latest_end_date.strftime('%B %Y')}</span>".html_safe do
          responses_count = Response.joins(user: :teams)
                                    .where(user: { teams: team })
                                    .working
                                    .count

          if responses_count.zero?
            div 'No data present for the all time period.'
          else

            responses_data_all, = vars[:responses_data_all]
            emotion_index_all, emotion_index_chart_all = vars[:emotion_index_all]
            productivity_avg_all = vars[:productivity_avg_all]
            participation_percentage_all = vars[:participation_percentage_all]
            celebrate_comments_count_all = vars[:celebrate_comments_count_all]
            teammate_engagement_count_all = vars[:teammate_engagement_count_all]

            attributes_table_for team do
              row :Emotion_Index do
                span emotion_index_all
              end

              row :Emotion_Chart do
                emotion_index_chart_all
              end

              row :Productivity_Average do
                span productivity_avg_all
              end

              row :Participation_Percentage do
                span participation_percentage_all
              end

              row :Responses_Report do
                raw responses_data_all
              end

              row :Celebrations_Count do
                celebrate_comments_count_all
              end

              row :Teammate_Engagement_Count do
                teammate_engagement_count_all
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
