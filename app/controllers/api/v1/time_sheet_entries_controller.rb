class Api::V1::TimeSheetEntriesController < ApplicationController
  before_action :authenticate_user!

  def create
    saved_entries = []

    ActiveRecord::Base.transaction do
      time_sheet_entries_params.each do |entry_params|
        time_sheet_entry = TimeSheetEntry.new(entry_params)
        unless time_sheet_entry.save
          render json: { errors: time_sheet_entry.errors.full_messages }, status: :unprocessable_entity
          raise ActiveRecord::Rollback
        end

        saved_entries << TimeSheetEntrySerializer.new(time_sheet_entry).serializable_hash
      end
    end

    render json: saved_entries, status: :created unless performed?
  end

  private

  def time_sheet_entries_params
    params.permit(time_sheet_entries: %i[user_id project_id time_period_id total_hours])[:time_sheet_entries]
  end
end
