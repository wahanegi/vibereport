# == Schema Information
#
# Table name: time_sheet_entries
#
#  id             :bigint           not null, primary key
#  total_hours    :integer          not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  project_id     :bigint           not null
#  time_period_id :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_time_sheet_entries_on_project_id      (project_id)
#  index_time_sheet_entries_on_time_period_id  (time_period_id)
#  index_time_sheet_entries_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (time_period_id => time_periods.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :time_sheet_entry do
    user
    project
    time_period
    total_hours { 8 }
  end
end
