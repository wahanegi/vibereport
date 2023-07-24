FactoryBot.define do
  factory :logo do
    type { 'Logo' }
    trait :image do
      after(:build) do |logo|
        logo.image.attach(io: Rails.root.join('spec', 'fixtures', 'files', 'test_image.png').open, filename: 'test_image.png', content_type: 'image/png')
      end
    end
  end
end
