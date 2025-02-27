# == Schema Information
#
# Table name: time_periods
#
#  id         :bigint           not null, primary key
#  due_date   :date
#  end_date   :date
#  slug       :string
#  start_date :date
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_time_periods_on_slug  (slug) UNIQUE
#
class TimePeriod < ApplicationRecord
  has_one :fun_question, dependent: :destroy
  has_many :responses, dependent: :destroy
  has_many :emotions, through: :responses
  has_many :shoutouts, dependent: :destroy

  before_create :slugify

  validates :end_date, :start_date, presence: true
  validates :end_date, comparison: { greater_than: :start_date }

  scope :ordered, -> { order(start_date: :desc) }
  scope :with_responses_by_team, ->(team) { joins(responses: { user: :user_teams }).where(user_teams: { team_id: team.id }) }

  def slugify
    self.slug = SecureRandom.hex(5)
  end

  class << self
    def current_time_period
      TimePeriod.find_by(start_date: Date.current.., end_date: ..Date.current + 6.days)
    end

    def current
      TimePeriod.find_by(start_date: ..Date.current, end_date: Date.current..)
    end

    def find_or_create_time_period
      TimePeriod.current || TimePeriod.create_time_period
    end

    def previous_time_period
      find_or_create_time_period
      TimePeriod.find_by(end_date: TimePeriod.current.end_date.ago(1.week))
    end

    def create_time_period
      return if current_time_period.present?

      start_date = Date.current.beginning_of_week(day_that_week_starts)
      end_date = start_date + 6.days
      due_date = (start_date..end_date).find { |date| date.strftime('%A').downcase.to_sym == day_to_send_invites }
      TimePeriod.create!(start_date:, end_date:, due_date:)
    end

    def day_that_week_starts
      ENV['START_WEEK_DAY']&.to_sym || :monday
    end

    def day_to_send_invites
      ENV['DAY_TO_SEND_INVITES']&.to_sym || :friday
    end
  end

  def date_range
    "#{start_date.strftime('%Y-%m-%d')} - #{end_date.strftime('%Y-%m-%d')}"
  end

  def date_range_str
    "#{start_date.strftime('%b %d')} - #{end_date.strftime('%b %d')}"
  end

  def self.ransackable_attributes(_auth_object = nil)
    %w[due_date end_date slug start_date]
  end
end
