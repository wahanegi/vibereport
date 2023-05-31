ActiveAdmin.register_page 'Dashboard' do
  menu priority: 1, label: proc { I18n.t('active_admin.dashboard') }

  content title: proc { I18n.t("active_admin.dashboard") } do
    columns do
      current_period = TimePeriod.current
      panel "Average for range #{current_period&.date_range} / Average for all time periods" do
        all_periods = TimePeriod.all

        emotion_index_current_period = EmotionIndex.new(nil, [current_period]).generate
        emotion_index_all_periods = EmotionIndex.new(nil, all_periods).generate

        productivity_average_current_period = ProductivityAverage.new(nil, [current_period]).generate
        productivity_average_all_periods = ProductivityAverage.new(nil, all_periods).generate
        
        celebrations_count_current_period = CelebrationsCount.new(nil, [current_period]).generate
        celebrations_count_all_periods = CelebrationsCount.new(nil, all_periods).generate
        
        teammate_engagement_count_current_period = TeammateEngagementCount.new(nil, [current_period]).generate
        teammate_engagement_count_all_periods = TeammateEngagementCount.new(nil, all_periods).generate

        div do
          strong 'Emotion Index: '
          span "#{emotion_index_current_period[:emotion_index]} / #{emotion_index_all_periods[:emotion_index]}"
        end

        div do
          strong 'Productivity Average: '
          span "#{productivity_average_current_period} / #{productivity_average_all_periods}"
        end

        div do
          strong 'Celebrations Count: '
          span "#{celebrations_count_current_period} / #{celebrations_count_all_periods}"
        end

        div do
          strong 'Teammate Engagement Count: '
          span "#{teammate_engagement_count_current_period} / #{teammate_engagement_count_all_periods}"
        end
      end

      panel 'Recent Productivity Verbatims' do
        all_periods = TimePeriod.all

        div do
          strong 'Positive: '
          ul do
            positive_verbatims = ProductivityVerbatims.new(nil, all_periods).generate[:positive]
          end
        end

        div do
          strong 'Neutral: '
          ul do
            neutral_verbatims = ProductivityVerbatims.new(nil, all_periods).generate[:neutral]
          end
        end

        div do
          strong 'Negative: '
          ul do
            negative_verbatims = ProductivityVerbatims.new(nil, all_periods).generate[:negative]
          end
        end
      end
    end
  end

  controller do
    include EmotionsHelper

    helper_method :alert_questions_needed?

    def index
      if alert_questions_needed?
        flash[:alert] = 'Alert: No unused questions left for upcoming check-in. Please add more questions.'
      end
      super
    end
  end
end
