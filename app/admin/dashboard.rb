include ActiveAdminHelpers

ActiveAdmin.register_page 'Dashboard' do
  # menu priority: 1, label: proc { I18n.t('active_admin.dashboard') }
  #
  # content title: proc { I18n.t("active_admin.dashboard") } do
  #   columns do
  #     current_period = TimePeriod.current
  #     vars = ActiveAdminHelpers.time_period_vars(
  #       current_period: current_period
  #     )
  #
  #     panel "Average for range #{current_period&.date_range} / Average for all time periods" do
  #       div do
  #         strong 'Emotion Index: '
  #         span "#{vars[:emotion_index_current_period][0]} / #{vars[:emotion_index_all][0]}"
  #       end
  #
  #       div do
  #         strong 'Productivity Average: '
  #         span "#{vars[:productivity_average_current_period]} / #{vars[:productivity_avg_all]}"
  #       end
  #     end
  #
  #     panel "Celebrations and Teammate Engagement for range #{current_period&.date_range}" do
  #
  #       div do
  #         strong 'Celebrations Count: '
  #         span "#{vars[:celebrations_count_current_period]} "
  #       end
  #
  #       div do
  #         strong 'Teammate Engagement Count: '
  #         span "#{vars[:teammate_engagement_count_current_period]}"
  #       end
  #     end
  #
  #     panel 'Recent Productivity Verbatims' do
  #       div do
  #         strong 'Positive: '
  #         ul do
  #           Array(vars[:positive_verbatims]).each do |verbatim|
  #             verbatim.split('||').each do |comment|
  #               li comment.strip
  #             end
  #           end
  #         end
  #       end
  #
  #       div do
  #         strong 'Neutral: '
  #         ul do
  #           Array(vars[:neutral_verbatims]).each do |verbatim|
  #             verbatim.split('||').each do |comment|
  #               li comment.strip
  #             end
  #           end
  #         end
  #       end
  #
  #       div do
  #         strong 'Negative: '
  #         ul do
  #           Array(vars[:negative_verbatims]).each do |verbatim|
  #             verbatim.split('||').each do |comment|
  #               li comment.strip
  #             end
  #           end
  #         end
  #       end
  #     end
  #   end
  # end
  #
  # controller do
  #   include EmotionsHelper
  #
  #   helper_method :alert_questions_needed?
  #
  #   def index
  #     if alert_questions_needed?
  #       flash[:alert] = 'Alert: No unused questions left for upcoming check-in. Please add more questions.'
  #     end
  #     super
  #   end
  # end
end
