# == Schema Information
#
# Table name: projects
#
#  id         :bigint           not null, primary key
#  code       :string
#  company    :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_projects_on_code  (code) UNIQUE
#
class Project < ApplicationRecord
  validates :company, presence: true
  validates :code, presence: true, uniqueness: true
  validates :name, presence: true

  has_many :time_sheet_entries, dependent: :destroy

  def self.ransackable_attributes(_auth_object = nil)
    %w[id code company name]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[time_sheet_entries]
  end
end
