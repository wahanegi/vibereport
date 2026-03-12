# == Schema Information
#
# Table name: emotions
#
#  id         :bigint           not null, primary key
#  category   :integer          default("positive")
#  public     :boolean          default(FALSE)
#  word       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :emotion do
    sequence(:word) { |n| "emotion#{n}" }
    category { :positive }
    public { true }

    trait :negative do
      category { :negative }
    end

    trait :private do
      public { false }
    end
  end
end
