# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  first_name             :string
#  last_name              :string
#  manager                :boolean          default(FALSE)
#  not_ask_visibility     :boolean          default(FALSE), not null
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
FactoryBot.define do
  factory(:user) do
    email { Faker::Internet.unique.email }
    password { Faker::Internet.password(min_length: 6, max_length: 128) }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    opt_out { false }
    not_ask_visibility { false }
    manager { false }
  end
end
