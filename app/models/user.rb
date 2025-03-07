# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  first_name             :string
#  last_name              :string
#  not_ask_visibility     :boolean          default(FALSE), not null
#  opt_out                :boolean          default(FALSE)
#  remember_created_at    :datetime
#  remember_token         :string
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  time_period_index      :integer          default(0)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable, :rememberable, :validatable and :omniauthable
  devise :database_authenticatable, :registerable, :magic_link_authenticatable, :rememberable

  has_many :responses, dependent: :destroy
  has_many :shoutouts, dependent: :destroy
  has_many :shoutout_recipients, dependent: :destroy
  has_many :fun_questions, dependent: :destroy
  has_many :fun_question_answers, dependent: :destroy
  has_many :mentions, through: :shoutout_recipients, source: :shoutout
  has_many :user_teams, dependent: :destroy
  has_many :teams, through: :user_teams
  has_many :emojis, dependent: :destroy
  has_many :time_sheet_entries, dependent: :destroy
  before_validation :strip_first_name_last_name

  MAX_NAME_LENGTH = 15

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, if: :password_required?
  validates :first_name, :last_name, presence: true, length: { maximum: MAX_NAME_LENGTH }

  scope :opt_in, -> { where(opt_out: false) }
  scope :ordered, -> { order(first_name: :asc) }

  def full_name
    "#{first_name} #{last_name}"
  end

  def password_required?
    new_record? || password.present?
  end

  def strip_first_name_last_name
    first_name&.strip!
    last_name&.strip!
  end

  def self.ransackable_attributes(_auth_object = nil)
    %w[email first_name id last_name not_ask_visibility opt_out time_period_index updated_at]
  end
end
