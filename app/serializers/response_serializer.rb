class ResponseSerializer
  include FastJsonapi::ObjectSerializer

  attributes :user_id, :time_period_id, :emotion_id
end