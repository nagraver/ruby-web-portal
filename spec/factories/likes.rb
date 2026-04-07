FactoryBot.define do
  factory :like do
    user

    trait :on_article do
      association :likeable, factory: :article
    end
  end
end
