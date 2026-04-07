FactoryBot.define do
  factory :comment do
    body { Faker::Lorem.paragraph }
    user

    trait :on_article do
      association :commentable, factory: :article
    end

    trait :on_review do
      association :commentable, factory: :review
    end
  end
end
