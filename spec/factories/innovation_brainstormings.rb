# == Schema Information
#
# Table name: innovation_brainstormings
#
#  id                  :bigint           not null, primary key
#  brainstorming_body  :text             not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  innovation_topic_id :bigint           not null
#  user_id             :bigint           not null
#
# Indexes
#
#  index_innovation_brainstormings_on_innovation_topic_id  (innovation_topic_id)
#  index_innovation_brainstormings_on_user_id              (user_id)
#  index_unique_brainstorm_on_user_and_topic               (user_id,innovation_topic_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (innovation_topic_id => innovation_topics.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :innovation_brainstorming do
    brainstorming_body { Faker::Lorem.sentence }
    association :user
    association :innovation_topic
  end
end
