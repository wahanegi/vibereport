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
FactoryBot.define do
  factory :project do
    company { Faker::Company.name }
    code { Faker::Alphanumeric.alphanumeric(number: 8).upcase }
    name { Faker::Commerce.product_name }
  end
end
