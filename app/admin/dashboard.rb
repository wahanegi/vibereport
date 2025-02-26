include ActiveAdminHelpers

ActiveAdmin.register_page 'Dashboard' do
  menu priority: 1, label: proc { I18n.t('active_admin.dashboard') }

  content title: proc { I18n.t('active_admin.dashboard') } do
    columns do
      current_time_period = TimePeriod.current
      vars = ActiveAdminHelpers.time_period_vars(
        current_period: current_time_period,
        only: %i[productivity_verbatims]
      )

      unless vars[:productivity_verbatims] == 'No productivity comment present'
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

      if current_time_period
        panel "Nag Emails for Current Time Period (ending #{current_time_period.end_date} )" do
          users_without_responses = User.where.not(id: Response.where(time_period_id: current_time_period.id).select(:user_id))

          table_for users_without_responses do
            column :name do |user|
              "#{user.full_name} (#{user.email})"
            end

            column 'Reminder Link' do |user|
              if current_time_period
                div class: 'custom-textarea-style' do
                  text_node api_v1_response_flow_from_email_url(time_period_id: current_time_period.id, user_id: user.id)
                end
              else
                text_node 'No current TimePeriod available.'
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
      flash[:alert] =
        'Alert: No unused questions left for upcoming check-in. Please add more questions.' if alert_questions_needed?
      super
    end
  end
end
