class TimeSheetEntrySerializer
    include JSONAPI::Serializer
  
    attributes :id, :user_id, :project_id, :time_period_id, :total_hours

  end
  