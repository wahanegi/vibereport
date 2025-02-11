include ActiveAdminHelpers

ActiveAdmin.register_page 'Dashboard' do
  menu priority: 1, label: proc { I18n.t('active_admin.dashboard') }

  content title: proc { I18n.t("active_admin.dashboard") } do
    columns do
      current_period = TimePeriod.current
      vars = ActiveAdminHelpers.time_period_vars(
        current_period: current_period
      )

      panel "Average for range #{current_period&.date_range} / Average for all time periods" do
        div do
          strong 'Emotion Index: '
          span "#{vars[:emotion_index_current_period][0]} / #{vars[:emotion_index_all][0]}"
        end

        div do
          strong 'Productivity Average: '
          span "#{vars[:productivity_average_current_period]} / #{vars[:productivity_avg_all]}"
        end
      end

      panel "Celebrations and Teammate Engagement for range #{current_period&.date_range}" do
        div do
          strong 'Celebrations Count: '
          span "#{vars[:celebrations_count_current_period]} "
        end

        div do
          strong 'Teammate Engagement Count: '
          span (vars[:teammate_engagement_count_current_period]).to_s
        end
      end

      unless vars[:productivity_verbatims] == "No productivity comment present"
        panel 'Recent Productivity Comments' do
          div do
            ul do
              Array(vars[:productivity_verbatims]).each do |verbatim|
                verbatim.split('||').each do |comment|
                  li comment.strip
                end
              end
            end
          end
        end
      end

      unless TimePeriod.current.nil?
        panel "Nag Emails for Current Time Period (ending #{current_period&.end_date} )" do
          users_without_responses = User.where.not(id: Response.where(time_period_id: current_period&.id).select(:user_id))

          table_for users_without_responses do
            column :name do |user|
              "#{user.full_name} (#{user.email})"
            end

            column "Reminder Link" do |user|
              if TimePeriod.current
                general_link = url_for(URL.merge({ time_period_id: TimePeriod.current.id, user_id: user.id, host: 'https://cp.vibereport.app' }))

                div class: "custom-textarea-style" do
                  text_node general_link
                end
              else
                text_node "No current TimePeriod available."
              end
            end

            column :send_reminder do |user|
              form_tag send_reminder_api_v1_user_path(user), method: :post do
                submit_tag 'Send via email'
              end
            end
          end
        end
      end
    end
  end

  controller do
    include EmotionsHelper

    helper_method :alert_questions_needed?

    def index
      not_viewed = Notification.not_viewed
      flash[:alert] = 'Alert: No unused questions left for upcoming check-in. Please add more questions.' if alert_questions_needed?
      if not_viewed.present?
        flash[:alert] = "NOTICE: #{not_viewed.count} new #{'notification'.pluralize(not_viewed.count)} " \
                        "from #{'user'.pluralize(not_viewed.pluck(:user_id).uniq.count)}"
      end
      super
    end
  end
end
