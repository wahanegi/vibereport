# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  first_name             :string
#  last_name              :string
#  opt_out                :boolean          default(FALSE)
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
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
  devise :database_authenticatable, :registerable

  has_many :responses, dependent: :destroy
  has_many :shoutouts, dependent: :destroy
  has_many :shoutout_recipients, dependent: :destroy
  has_many :fun_questions, dependent: :destroy
  has_many :fun_question_answers, dependent: :destroy
  has_many :mentions, through: :shoutout_recipients, source: :shoutout
  has_many :users_teams, dependent: :destroy
  has_many :teams, through: :users_teams

  MAX_NAME_LENGTH = 15

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true
  validates :first_name, :last_name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  passwordless_with :email
  scope :opt_in, -> { where(opt_out: false) }
  scope :ordered, -> { order(first_name: :asc) }

  def to_full_name
    "#{first_name} #{last_name}"
  end

  def self.extract_user_ids_from_comment(comment)
    comment.scan(/@\[.*?\]\((\d+)\)/).flatten.map(&:to_i)
  end

  def received_celebrate_comments
    Response.where.not(celebrate_comment: nil).select do |response|
      user_ids = User.extract_user_ids_from_comment(response.celebrate_comment)
      puts "User IDs in comment: #{user_ids}"
      user_ids.include?(id)
    end
  end
end
