# == Schema Information
#
# Table name: shoutouts
#
#  id             :bigint           not null, primary key
#  public         :boolean          default(TRUE), not null
#  rich_text      :text             not null
#  type           :string
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
  has_many :emojis, as: :emojiable, dependent: :destroy

  validates :rich_text, presence: true, uniqueness: { scope: %i[user_id time_period_id] }

  scope :not_celebrate, -> { where(type: nil) }

  def to_text
    rich_text.gsub(%r{<span class="color-primary">|</span>}, '')
  end

  def recipient
    shoutout_recipients.ids.map do |id|
      user = User.find(ShoutoutRecipient.find(id).user_id)
      "#{user.first_name} #{user.last_name}"
    end
  end

  def full_name
    "#{user.first_name} #{user.last_name}"
  end

  def time_period_range
    time_period.date_range
  end

  def self.ransackable_attributes(_auth_object = nil)
    %w[public time_period_id type user_id]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[emojis recipients shoutout_recipients time_period user]
  end
end
