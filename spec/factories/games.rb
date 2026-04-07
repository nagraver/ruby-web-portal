FactoryBot.define do
  factory :game do
    title { Faker::Game.unique.title }
    description { Faker::Lorem.paragraph(sentence_count: 3) }
    developer { Faker::Company.name }
    publisher { Faker::Company.name }
    release_date { Faker::Date.between(from: 5.years.ago, to: Date.today) }
    average_rating { 0.0 }
  end
end
