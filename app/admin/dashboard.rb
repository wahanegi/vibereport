# frozen_string_literal: true
ActiveAdmin.register_page 'Dashboard' do
  menu priority: 1, label: proc { I18n.t('active_admin.dashboard') }

  content title: proc { I18n.t('active_admin.dashboard') } do
    panel "This Time Period compared to Average" do
      current_time_period = TimePeriod.current
      time_period_id = current_time_period.id
      responses_current = Response.includes(user: { teams: :users_teams })
                          .where(responses: { time_period_id: time_period_id })
                          .distinct
      responses_all = Response.includes(user: { teams: :users_teams }).distinct

      div do
        "total responses count: " + total_responses(responses_all).to_s 
      end

      div do
        "Emotion Index: " + calculate_emotion_index(responses_current).to_s + " / " + calculate_emotion_index(responses_all).to_s
      end
      div do
        "Productivity Average: "
      end
      div do
        "Productivity Bleeders Count: "
      end
      div do
        "Productivity Boosters Count: "
      end
      div do
        "Celebrations Count: "
      end
      div do
        "Teammate Engagement Count: "
      end
    end
  end
end

private

def calculate_emotion_index(responses)
  positive_emotion_ids = responses.joins(:emotion)
                                  .where(emotions: { category: 'positive' })
                                  .distinct
                                  .pluck(:emotion_id)
  negative_emotion_ids = responses.joins(:emotion)
                                  .where(emotions: { category: 'negative' })
                                  .distinct
                                  .pluck(:emotion_id)

  puts "Positive Emotion IDs: #{positive_emotion_ids}"
  puts "Negative Emotion IDs: #{negative_emotion_ids}"

  positive_ratings_sum = responses.where(emotion_id: positive_emotion_ids).distinct.sum(:rating)
  negative_ratings_sum = responses.where(emotion_id: negative_emotion_ids).distinct.sum(:rating)

  puts "Positive Ratings Sum: #{positive_ratings_sum}"
  puts "Negative Ratings Sum: #{negative_ratings_sum}"

  total_responses = responses.count

  total_responses > 0 ? (positive_ratings_sum - negative_ratings_sum) / total_responses.to_f : 0
end

def total_responses(responses)
  responses.count
end
