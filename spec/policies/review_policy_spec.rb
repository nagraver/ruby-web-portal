require 'rails_helper'

RSpec.describe ReviewPolicy, type: :policy do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:admin) { create(:user, :admin) }
  let(:game) { create(:game) }
  let(:review) { create(:review, user: user, game: game) }

  describe "create?" do
    it "allows authenticated users" do
      expect(ReviewPolicy.new(user, Review.new).create?).to be true
    end

    it "denies guests" do
      expect(ReviewPolicy.new(nil, Review.new).create?).to be false
    end
  end

  describe "update?" do
    it "allows the review author" do
      expect(ReviewPolicy.new(user, review).update?).to be true
    end

    it "denies other users" do
      expect(ReviewPolicy.new(other_user, review).update?).to be false
    end
  end

  describe "destroy?" do
    it "allows the review author" do
      expect(ReviewPolicy.new(user, review).destroy?).to be true
    end

    it "allows admins" do
      expect(ReviewPolicy.new(admin, review).destroy?).to be true
    end

    it "denies other users" do
      expect(ReviewPolicy.new(other_user, review).destroy?).to be false
    end
  end
end
