ActiveAdmin.register TimePeriod do
  permit_params  :start_date, :end_date, :due_date

  index do
    selectable_column
    id_column
    column :start_date
    column :end_date
    column :created_at
    column :due_date
    actions
  end

  show do
    columns do
      column do
        panel 'Productivity Verbatims' do
          responses_with_comment = time_period.responses.select { |response| response.comment.present? }
          
          if responses_with_comment.any?
            table_for responses_with_comment do
              column 'Author' do |response|
                response.user.to_full_name
              end
              column 'Message' do |response|
                response.comment
              end
            end
          else
            'No comments present.'
          end
        end
      end

      column do
        panel 'Celebration Verbatims' do
          celebrate_responses = time_period.responses.celebrated { |response| response.celebrate_comment.present? }
          
          if celebrate_responses.any?
            table_for celebrate_responses do
              column 'Author' do |response|
                response.user.to_full_name
              end
              column 'Message' do |response|
                response.celebrate_comment.gsub(/\[(.*?)\]\(\d+\)/, '\1')
              end
            end
          else
            'No celebration comments present.'
          end
        end
      end

      column do
        panel 'Teammate Engagement Verbatims' do
          shoutouts_with_message = time_period.shoutouts.select { |shoutout| shoutout.rich_text.present? }
          
          if shoutouts_with_message.any?
            table_for shoutouts_with_message do
              column 'Author' do |shoutout|
                shoutout.user.to_full_name
              end
              column 'Message' do |shoutout|
                strip_tags(shoutout.rich_text)
              end
            end
          else
            'No teammate engagement verbatims present.'
          end
        end
      end
    end
  end
end
