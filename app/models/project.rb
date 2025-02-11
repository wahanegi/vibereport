# == Schema Information
#
# Table name: projects
#
#  id         :bigint           not null, primary key
#  code       :string           not null
#  company    :string           not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_projects_on_code  (code) UNIQUE
#
class Project < ApplicationRecord
  before_save :normalize_code

  validates :company, presence: true
  validates :code, presence: true, uniqueness: true
  validates :name, presence: true

  def self.ransackable_attributes(_auth_object = nil)
    %w[company code name]
  end

  private

  def normalize_code
    self.code = code.upcase.strip if code.present?
  end
end
