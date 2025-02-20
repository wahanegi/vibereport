class TimeSheetEntrySerializer
    include JSONAPI::Serializer
  
    attributes :id, :total_hours, :created_at, :updated_at
  
    belongs_to :user
    belongs_to :project
    belongs_to :time_period
  end
  