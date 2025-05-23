# == Schema Information
#
# Table name: teams
#
#  id                :bigint           not null, primary key
#  name              :string(100)      not null
#  timesheet_enabled :boolean          default(FALSE), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_teams_on_name  (name) UNIQUE
#
FactoryBot.define do
  factory :team do
    name { Faker::Name.unique.name }
    timesheet_enabled { false }
  end
end
