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
FactoryBot.define do
  factory :project do
    company { Faker::Company.name }
    code { Faker::Alphanumeric.unique.alphanumeric(number: 8) }
    name { Faker::Commerce.product_name }
    deleted_at { nil }

    trait :deleted do
      deleted_at { Time.current }
    end
  end
end
