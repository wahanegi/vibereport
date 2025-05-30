class Api::V1::TimeSheetEntriesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_time_sheet_entry, only: %i[destroy]

  def index
    time_period = TimePeriod.current
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

    saved_entries = process_time_sheet_entries

    return if performed?

    render json: TimeSheetEntrySerializer.new(saved_entries, { include: [:project] }).serializable_hash,
           status: :ok
  end

  def destroy
    if @time_sheet_entry.destroy
      render json: {}, status: :ok
    else
      render json: { error: 'Failed to delete time sheet entry' }, status: :unprocessable_entity
    end
  end

  private

  def process_time_sheet_entries
    saved_entries = []
    time_period = TimePeriod.find_or_create_time_period

    ActiveRecord::Base.transaction do
      time_sheet_entries_params.each do |entry_params|
        merged_params = entry_params.merge(user_id: current_user.id, time_period_id: time_period.id)
        time_sheet_entry = TimeSheetEntry.find_or_initialize_by(id: entry_params[:id], user_id: current_user.id)
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

  def set_time_sheet_entry
    @time_sheet_entry = TimeSheetEntry.find_by(id: params[:id], user_id: current_user.id)
    render json: { error: 'Time sheet entry not found' }, status: :not_found unless @time_sheet_entry
  end
end
