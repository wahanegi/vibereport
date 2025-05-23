# == Schema Information
#
# Table name: projects
#
#  id         :bigint           not null, primary key
#  code       :string
#  company    :string
#  deleted_at :date
#  name       :string
#  usage      :integer          default("internal"), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_projects_on_code  (code) UNIQUE
#
class Project < ApplicationRecord
  include SoftDeletable

  normalizes :code, with: ->(code) { code.strip.upcase }
  validates :company, presence: true
  validates :code, presence: true, uniqueness: { case_sensitive: false }
  validates :name, presence: true
  validates :usage, presence: true

  enum :usage, { internal: 0, billable: 1 }, default: :internal, validate: true
  has_many :time_sheet_entries, dependent: :destroy

  # Override destroy
  def destroy
    if time_sheet_entries.any?
      soft_delete
      :soft_deleted
    else
      super
      :hard_deleted
    end
  end

  # Override destroy!
  def destroy!
    transaction do
      time_sheet_entries.destroy_all
      super
    end
  end

  def self.ransackable_attributes(_auth_object = nil)
    %w[id code company name deleted_at usage]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[time_sheet_entries]
  end
end
