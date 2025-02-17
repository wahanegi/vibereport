# == Schema Information
#
# Table name: projects
#
#  id         :bigint           not null, primary key
#  code       :string
#  company    :string
#  deleted_at :datetime
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_projects_on_code  (code) UNIQUE
#
class Project < ApplicationRecord
  normalizes :code, with: ->(code) { code.strip.upcase }

  validates :company, presence: true
  validates :code, presence: true, uniqueness: { case_sensitive: false }
  validates :name, presence: true

  before_destroy :handle_soft_delete

  scope :active, -> { where(deleted_at: nil) }

  def soft_delete!
    update(deleted_at: Time.current)
  end

  def deleted?
    deleted_at.present?
  end

  def self.ransackable_attributes(_auth_object = nil)
    %w[company code name]
  end
end
