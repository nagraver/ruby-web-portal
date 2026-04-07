FactoryBot.define do
  factory :article do
    title { Faker::Lorem.sentence }
    body { Faker::Lorem.paragraph(sentence_count: 5) }
    published_at { Time.current }
    association :user, factory: [ :user, :admin ]
    game { nil }

    trait :draft do
      published_at { nil }
    end

    trait :with_game do
      game
    end
  end
end
