# == Schema Information
#
# Table name: shoutouts
#
#  id             :bigint           not null, primary key
#  rich_text      :text             not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  time_period_id :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_shoutouts_on_rich_text_and_user_id_and_time_period_id  (rich_text,user_id,time_period_id) UNIQUE
#  index_shoutouts_on_time_period_id                            (time_period_id)
#  index_shoutouts_on_user_id                                   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
class Shoutout < ApplicationRecord
  belongs_to :user
  belongs_to :time_period

  has_many :shoutout_recipients, dependent: :destroy
  has_many :recipients, through: :shoutout_recipients, source: :user

  validates :rich_text, presence: true, uniqueness:{ scope: %i[user_id time_period_id] }
end

