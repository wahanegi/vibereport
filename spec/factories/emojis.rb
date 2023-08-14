# == Schema Information
#
# Table name: emojis
#
#  id             :bigint           not null, primary key
#  emoji_code     :string
#  emoji_name     :string
#  emojiable_type :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  emojiable_id   :bigint
#  user_id        :bigint
#
# Indexes
#
#  index_emojis_on_emojiable  (emojiable_type,emojiable_id)
#  index_emojis_on_user_id    (user_id)
#

FactoryBot.define do
  factory :emoji do
    emoji_code { Faker::SlackEmoji.people }
    emoji_name { Faker::SlackEmoji.name }
  end
end
