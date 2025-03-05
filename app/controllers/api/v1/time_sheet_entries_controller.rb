class Api::V1::TimeSheetEntriesController < ApplicationController
  before_action :authenticate_user!

  def index
    time_period = TimePeriod.current
    time_sheet_entries = time_period.time_sheet_entries.includes(:project).where(user_id: current_user.id)
    render json: TimeSheetEntrySerializer.new(time_sheet_entries, { include: [:project] }).serializable_hash, status: :ok
  rescue StandardError => e
    Rails.logger.error "Unexpected error in TimeSheetEntriesController#index: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: 'An unexpected error occurred' }, status: :internal_server_error
  end

  def create
    if time_sheet_entries_params.blank?
      return render json: { error: 'No timesheet entries provided' },
                    status: :unprocessable_entity
    end

    saved_entries = []
    time_period = TimePeriod.find_or_create_time_period

    ActiveRecord::Base.transaction do
      time_sheet_entries_params.each do |entry_params|
        merged_params = entry_params.merge(user_id: current_user.id, time_period_id: time_period.id)
        time_sheet_entry = TimeSheetEntry.new(merged_params)
        unless time_sheet_entry.save
          render json: { errors: time_sheet_entry.errors.full_messages }, status: :unprocessable_entity
          raise ActiveRecord::Rollback
        end
        saved_entries << time_sheet_entry
      end
    end
    render json: TimeSheetEntrySerializer.new(saved_entries).serializable_hash, status: :created unless performed?
  end

  def destroy
    time_sheet_entry = TimeSheetEntry.find(params[:id])

    if time_sheet_entry&.destroy
      render json: {}, status: :ok
    else
      render json: { error: 'Time sheet entry not found' }, status: :not_found
    end
  end

  private

  def time_sheet_entries_params
    params.permit(time_sheet_entries: %i[project_id total_hours])[:time_sheet_entries]
  end
end
