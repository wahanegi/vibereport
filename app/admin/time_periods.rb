ActiveAdmin.register TimePeriod do
  permit_params :start_date, :end_date, :due_date

  index do
    selectable_column
    id_column
    column :start_date
    column :end_date
    column :created_at
    column :due_date
    column :slug
    actions
  end

  filter :start_date, as: :date_range
  filter :end_date, as: :date_range
  filter :due_date, as: :date_range
  filter :slug, as: :string

  form do |f|
    f.inputs do
      f.input :start_date, as: :datepicker
      f.input :end_date, as: :datepicker
      f.input :due_date, as: :datepicker
    end
    f.actions
  end

  show do
    columns do
      column do
        panel 'Productivity Verbatims' do
          responses_with_comment = time_period.responses.select { |response| response.comment.present? }

          if responses_with_comment.any?
            table_for responses_with_comment do
              column 'Author' do |response|
                response.user.full_name
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
          responses_with_message = time_period.responses.select { |response| response.celebrate_comment.present? }

          if responses_with_message.any?
            table_for responses_with_message do
              column 'Author' do |response|
                response.user.full_name
              end
              column 'Message' do |response|
                response.celebrate_comment
              end
            end
          else
            'No celebration comments present.'
          end
        end
      end

      column do
        panel 'Shoutout Verbatims' do
          shoutouts_with_message = time_period.shoutouts.select { |shoutout| shoutout.type.nil? }

          if shoutouts_with_message.any?
            table_for shoutouts_with_message do
              column 'Author' do |shoutout|
                shoutout.user.full_name
              end
              column 'Message' do |shoutout|
                strip_tags(shoutout.rich_text)
              end
            end
          else
            'No shoutout verbatims present.'
          end
        end
      end
    end
  end
end
