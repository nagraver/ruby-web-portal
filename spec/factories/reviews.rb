FactoryBot.define do
  factory :review do
    title { Faker::Lorem.sentence(word_count: 4) }
    body { Faker::Lorem.paragraph(sentence_count: 3) }
    rating { rand(1..10) }
    user
    game
  end
end
