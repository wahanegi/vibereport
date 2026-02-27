class Api::V1::TimeSheetEntriesController < ApplicationController
  before_action :authenticate_user!, except: [:direct_entry]

  before_action :set_time_sheet_entry, only: %i[destroy]

  def index
    time_period = effective_time_period
    time_sheet_entries = time_period.time_sheet_entries.includes(:project).where(user_id: current_user.id)

    render json: TimeSheetEntrySerializer.new(time_sheet_entries, { include: [:project] }).serializable_hash, status: :ok
  rescue StandardError => e
    Rails.logger.error "Unexpected error in TimeSheetEntriesController#index: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: 'An unexpected error occurred' }, status: :internal_server_error
  end

  def upsert
    if time_sheet_entries_params.blank?
      return render json: { error: 'No timesheet entries provided' }, status: :unprocessable_entity
    end

    time_period = effective_time_period
    saved_entries = process_time_sheet_entries(time_period)
    return if performed?

    final_submit = ActiveModel::Type::Boolean.new.cast(params[:final_submit])
    direct_id = session[:direct_timesheet_time_period_id]
    session.delete(:direct_timesheet_time_period_id) if direct_id.present? && final_submit

    render json: TimeSheetEntrySerializer.new(saved_entries, { include: [:project] }).serializable_hash
                                         .merge(meta: { time_period_id: time_period.id,
                                                        time_period_slug: time_period.slug }),
           status: :ok
  end

  def destroy
    if @time_sheet_entry.destroy
      render json: {}, status: :ok
    else
      render json: { error: 'Failed to delete time sheet entry' }, status: :unprocessable_entity
    end
  end

  def direct_entry
    payload = TimeSheets::DirectLinkBuilder.verify(params[:token])

    if payload.blank?
      session.delete(:direct_timesheet_time_period_id)
      redirect_to new_user_session_path, alert: 'Invalid or expired link'
      return
    end

    user_id   = payload[:user_id]
    period_id = payload[:time_period_id]

    user = User.find_by(id: user_id)
    time_period = TimePeriod.find_by(id: period_id)

    if user.blank? || time_period.blank?
      session.delete(:direct_timesheet_time_period_id)
      redirect_to new_user_session_path, alert: 'Invalid link'
      return
    end

    unless user.teams.exists?(timesheet_enabled: true)
      session.delete(:direct_timesheet_time_period_id)
      redirect_to new_user_session_path, alert: 'Access denied'
      return
    end

    unless TimePeriod.overdue.exists?(id: time_period.id)
      session.delete(:direct_timesheet_time_period_id)
      redirect_to app_path
      return
    end

    sign_in(user)
    session[:direct_timesheet_time_period_id] = time_period.id
    redirect_to app_path
  end

  private

  def process_time_sheet_entries(time_period)
    saved_entries = []

    ActiveRecord::Base.transaction do
      time_sheet_entries_params.each do |entry_params|
        merged_params = entry_params.merge(user_id: current_user.id, time_period_id: time_period.id)
        time_sheet_entry =
          if entry_params[:id].present?
            found = TimeSheetEntry.find_by(id: entry_params[:id], user_id: current_user.id)
            unless found
              render json: { error: 'Time sheet entry not found' }, status: :not_found
              raise ActiveRecord::Rollback
            end
            found
          else
            TimeSheetEntry.find_or_initialize_by(
              user_id: current_user.id,
              time_period_id: time_period.id,
              project_id: entry_params[:project_id]
            )
          end

        time_sheet_entry.assign_attributes(merged_params)

        unless time_sheet_entry.save
          render json: { errors: time_sheet_entry.errors.full_messages }, status: :unprocessable_entity
          raise ActiveRecord::Rollback
        end

        saved_entries << time_sheet_entry
      end
    end

    saved_entries
  end

  def time_sheet_entries_params
    params.permit(time_sheet_entries: %i[id project_id total_hours])[:time_sheet_entries]
  end

  def effective_time_period
    direct_id = session[:direct_timesheet_time_period_id]
    return TimePeriod.find_or_create_time_period if direct_id.blank?

    TimePeriod.find_by(id: direct_id).presence || TimePeriod.find_or_create_time_period
  end

  def set_time_sheet_entry
    @time_sheet_entry = TimeSheetEntry.find_by(id: params[:id], user_id: current_user.id)
    render json: { error: 'Time sheet entry not found' }, status: :not_found unless @time_sheet_entry
  end
end
