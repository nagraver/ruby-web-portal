FactoryBot.define do
  factory :genre do
    name { Faker::Game.unique.genre }
  end
end
