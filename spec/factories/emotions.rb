# == Schema Information
#
# Table name: emotions
#
#  id         :bigint           not null, primary key
#  category   :integer          default("neutral")
#  public     :boolean          default(FALSE)
#  word       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :emotion do
    word { Faker::Emotion.unique.adjective }
    category { [:negative, :neutral, :positive].sample }
    public { true }
  end
end
