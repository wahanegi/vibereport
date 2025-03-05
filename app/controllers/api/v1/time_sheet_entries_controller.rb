class Api::V1::TimeSheetEntriesController < ApplicationController
  before_action :authenticate_user!

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
    p saved_entries
    render json: TimeSheetEntrySerializer.new(saved_entries).serializable_hash, status: :created unless performed?
  end

  private

  def time_sheet_entries_params
    params.permit(time_sheet_entries: %i[project_id total_hours])[:time_sheet_entries]
  end
end
