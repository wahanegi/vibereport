# == Schema Information
#
# Table name: emotions
#
#  id         :bigint           not null, primary key
#  category   :integer          default("neutral")
#  word       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory (:emotion) do
    word              { Faker::Lorem.characters(number: (rand 2..15)) }
    category          { [:negative, :neutral, :positive].sample }
  end
end
