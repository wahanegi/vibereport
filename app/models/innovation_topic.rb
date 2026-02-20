# == Schema Information
#
# Table name: innovation_topics
#
#  id              :bigint           not null, primary key
#  innovation_body :text             not null
#  posted          :boolean          default(FALSE)
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
class InnovationTopic < ApplicationRecord
  belongs_to :user
  belongs_to :time_period, optional: true

  has_many :innovation_brainstormings, dependent: :destroy
  has_one :response, dependent: :nullify

  validates :innovation_body, presence: true

  def self.ransackable_attributes(_auth_object = nil)
    %w[id innovation_body posted time_period_id created_at updated_at user_id]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[innovation_brainstormings response time_period user]
  end
end
