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
#  index_unique_brainstorm_on_user_and_topic               (user_id,innovation_topic_id) UNIQUE
#  index_innovation_brainstormings_on_innovation_topic_id  (innovation_topic_id)
#  index_innovation_brainstormings_on_user_id              (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (innovation_topic_id => innovation_topics.id)
#  fk_rails_...  (user_id => users.id)
#
class InnovationBrainstorming < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :innovation_topic, optional: true

  has_one :response, dependent: :nullify

  validates :user, presence: true
  validates :innovation_topic, presence: true
  validates :brainstorming_body, presence: true
  validates :user_id, uniqueness: { scope: :innovation_topic_id, message: 'can submit only one brainstorming per topic' }

  def display_name
    "Innovation brainstorming: #{brainstorming_body.truncate(45)}"
  end

  def short_name(length: 50)
    brainstorming_body.truncate(length)
  end

  def self.ransackable_attributes(_auth_object = nil)
    %w[id brainstorming_body innovation_topic_id user_id created_at updated_at deleted_at]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[innovation_topic user response]
  end
end
