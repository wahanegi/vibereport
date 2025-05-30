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

class ProjectSerializer
  include JSONAPI::Serializer
  attributes :company, :code, :name, :usage

  attribute :name_with_code do |object|
    "#{object.name} | #{object.code}"
  end
end
