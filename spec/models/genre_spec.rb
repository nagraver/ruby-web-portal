require 'rails_helper'

RSpec.describe Genre, type: :model do
  describe "associations" do
    it { should have_many(:game_genres).dependent(:destroy) }
    it { should have_many(:games).through(:game_genres) }
  end

  describe "validations" do
    subject { build(:genre) }

    it { should validate_presence_of(:name) }
    it { should validate_uniqueness_of(:name).case_insensitive }
  end

  describe "scopes" do
    it ".sorted orders by name" do
      z_genre = create(:genre, name: "Zzz")
      a_genre = create(:genre, name: "Aaa")
      expect(Genre.sorted.first).to eq(a_genre)
    end
  end
end
