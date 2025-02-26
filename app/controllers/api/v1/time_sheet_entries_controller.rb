class Api::V1::TimeSheetEntriesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_resources, only: :create

  def create
    time_sheet_entry = TimeSheetEntry.new(time_sheet_entry_params)

    if time_sheet_entry.save
      render json: TimeSheetEntrySerializer.new(time_sheet_entry).serializable_hash, status: :created
    else
      render json: { errors: time_sheet_entry.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def time_sheet_entry_params
    params.require(:time_sheet_entry).permit(:user_id, :project_id, :time_period_id, :total_hours)
  end

  def set_resources
    unless User.exists?(params[:time_sheet_entry][:user_id])
      render json: { error: 'User not found' }, status: :not_found and return
    end

    unless Project.exists?(params[:time_sheet_entry][:project_id])
      render json: { error: 'Project not found' }, status: :not_found and return
    end

    return if TimePeriod.exists?(params[:time_sheet_entry][:time_period_id])

    render json: { error: 'Time Period not found' }, status: :not_found and return
  end
end
