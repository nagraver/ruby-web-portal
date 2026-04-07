require 'rails_helper'

RSpec.describe Game, type: :model do
  describe "associations" do
    it { should have_many(:game_genres).dependent(:destroy) }
    it { should have_many(:genres).through(:game_genres) }
    it { should have_many(:articles).dependent(:nullify) }
    it { should have_many(:reviews).dependent(:destroy) }
  end

  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_numericality_of(:average_rating).is_greater_than_or_equal_to(0).is_less_than_or_equal_to(10).allow_nil }
  end

  describe "scopes" do
    let!(:old_game) { create(:game, release_date: 2.years.ago) }
    let!(:new_game) { create(:game, release_date: 1.day.ago) }
    let!(:top_game) { create(:game, average_rating: 9.5) }
    let!(:low_game) { create(:game, average_rating: 3.0) }

    it ".recent orders by release_date desc" do
      expect(Game.recent.first).to eq(new_game)
    end

    it ".top_rated orders by average_rating desc" do
      expect(Game.top_rated.first).to eq(top_game)
    end
  end

  describe "#recalculate_rating!" do
    let(:game) { create(:game) }

    it "calculates average from reviews" do
      create(:review, game: game, rating: 8)
      create(:review, game: game, rating: 6)
      game.recalculate_rating!
      expect(game.average_rating.to_f).to eq(7.0)
    end

    it "sets 0 when no reviews" do
      game.recalculate_rating!
      expect(game.average_rating.to_f).to eq(0.0)
    end
  end

  describe ".by_genre" do
    it "filters games by genre" do
      genre = create(:genre)
      game_in_genre = create(:game)
      create(:game_genre, game: game_in_genre, genre: genre)
      create(:game)

      expect(Game.by_genre(genre.id)).to include(game_in_genre)
    end
  end
end
