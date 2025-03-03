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

  def validate_resource(model, id_param, error_message)
    id_value = params.dig(:time_sheet_entry, id_param)
    unless id_value && model.exists?(id_value)
      render json: { error: error_message }, status: :not_found
      return
    end
  end
  
  def set_resources
    validate_resource(User, :user_id, 'User not found')
    validate_resource(Project, :project_id, 'Project not found')
    validate_resource(TimePeriod, :time_period_id, 'Time Period not found')
  end
end
