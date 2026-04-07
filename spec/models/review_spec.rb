require 'rails_helper'

RSpec.describe Review, type: :model do
  describe "associations" do
    it { should belong_to(:user) }
    it { should belong_to(:game) }
    it { should have_many(:comments).dependent(:destroy) }
  end

  describe "validations" do
    subject { build(:review) }

    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:body) }
    it { should validate_presence_of(:rating) }
    it { should validate_numericality_of(:rating).only_integer }
    it { should validate_uniqueness_of(:user_id).scoped_to(:game_id).with_message("уже оставил отзыв на эту игру") }
  end

  describe "callbacks" do
    it "updates game rating after save" do
      game = create(:game)
      create(:review, game: game, rating: 8)
      expect(game.reload.average_rating.to_f).to eq(8.0)
    end

    it "updates game rating after destroy" do
      game = create(:game)
      r1 = create(:review, game: game, rating: 8)
      create(:review, game: game, rating: 6)
      r1.destroy
      expect(game.reload.average_rating.to_f).to eq(6.0)
    end
  end
end
