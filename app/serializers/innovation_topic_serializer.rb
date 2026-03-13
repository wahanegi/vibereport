# == Schema Information
#
# Table name: innovation_topics
#
#  id              :bigint           not null, primary key
#  innovation_body :text             not null
#  posted          :boolean          default(FALSE), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  time_period_id  :bigint
#  user_id         :bigint           not null
#
# Indexes
#
#  index_innovation_topics_on_time_period_id  (time_period_id)
#  index_innovation_topics_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
class InnovationTopicSerializer
  include JSONAPI::Serializer

  attributes :id, :innovation_body, :posted, :time_period_id, :user_id
end
