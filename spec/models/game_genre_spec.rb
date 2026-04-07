require 'rails_helper'

RSpec.describe GameGenre, type: :model do
  describe "associations" do
    it { should belong_to(:game) }
    it { should belong_to(:genre) }
  end

  describe "validations" do
    subject { build(:game_genre) }

    it { should validate_uniqueness_of(:genre_id).scoped_to(:game_id) }
  end
end
