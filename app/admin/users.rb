ActiveAdmin.register User do
  permit_params :first_name, :last_name, :email, :password, :opt_out, :not_ask_visibility, :manager

  index do
    selectable_column
    column :first_name
    column :last_name
    column :email
    column :created_at
    column :opt_out
    column :not_ask_visibility
    column :manager
    actions
  end

  filter :email, as: :string
  filter :first_name, as: :string
  filter :last_name, as: :string
  filter :not_ask_visibility, as: :boolean
  filter :opt_out, as: :boolean
  filter :manager, as: :boolean

  show do
    attributes_table do
      row :email
      row :first_name
      row :last_name
      row :opt_out
      row :not_ask_visibility
      row :manager
      row :created_at
      row :updated_at
      row :team do |user|
        user.user_teams.map(&:team).map(&:name).join(', ')
      end
    end

    columns do
      column do
        panel 'Received Shoutouts' do
          if user.shoutout_recipients.present?
            table_for user.shoutout_recipients.joins(:shoutout).where(shoutouts: { type: nil }).order(created_at: :desc) do
              column 'From' do |shoutout_recipient|
                shoutout_recipient.shoutout.user.full_name
              end
              column 'Message' do |shoutout_recipient|
                strip_tags(shoutout_recipient.shoutout.rich_text)
              end
              column 'Time Period' do |shoutout_recipient|
                start_date = shoutout_recipient.shoutout.time_period.start_date.to_s
                end_date = shoutout_recipient.shoutout.time_period.end_date.to_s
                content_tag :span, "#{start_date} - #{end_date}", class: 'highlight-date'
              end
            end
          else
            'No received shoutouts present.'
          end
        end
      end

      column do
        panel 'Sent Celebration Verbatims' do
          responses_with_celebrate = user.responses.select { |response| response.celebrate_comment.present? }

          if responses_with_celebrate.present?
            table_for responses_with_celebrate do
              column 'Message' do |response|
                response.celebrate_comment
              end
              column 'Time Period' do |response|
                start_date = response.time_period.start_date.to_s
                end_date = response.time_period.end_date.to_s
                content_tag :span, "#{start_date} - #{end_date}", class: 'highlight-date'
              end
            end
          else
            'No celebration verbatims present.'
          end
        end
      end
    end
  end

  form do |f|
    f.inputs do
      f.input :first_name
      f.input :last_name
      f.input :email
      f.input :opt_out
      f.input :not_ask_visibility
      f.input :manager, as: :boolean
    end
    f.actions
  end

  controller do
    def create
      params[:user][:password] = Devise.friendly_token[6, 10]
      @user = User.new(permitted_params[:user])
      super
    end

    def update
      user = User.find(params[:id])
      error_message = nil
      params[:user][:password] = Devise.friendly_token[6, 10]
      begin
        user.update!(permitted_params[:user])
      rescue StandardError => e
        error_message = e.message
      end

      notice_message = error_message ? nil : 'Successfully updated!'
      redirect_to admin_users_path, notice: notice_message, alert: error_message
    end
  end
end
