require 'rails_helper'

RSpec.describe GenrePolicy, type: :policy do
  let(:user) { create(:user) }
  let(:admin) { create(:user, :admin) }
  let(:genre) { create(:genre) }

  describe "index?" do
    it "allows everyone" do
      expect(GenrePolicy.new(nil, genre).index?).to be true
    end
  end

  describe "show?" do
    it "allows everyone" do
      expect(GenrePolicy.new(nil, genre).show?).to be true
    end
  end

  describe "create?" do
    it "denies regular users" do
      expect(GenrePolicy.new(user, genre).create?).to be false
    end

    it "allows admins" do
      expect(GenrePolicy.new(admin, genre).create?).to be true
    end
  end

  describe "update?" do
    it "denies regular users" do
      expect(GenrePolicy.new(user, genre).update?).to be false
    end

    it "allows admins" do
      expect(GenrePolicy.new(admin, genre).update?).to be true
    end
  end

  describe "destroy?" do
    it "denies regular users" do
      expect(GenrePolicy.new(user, genre).destroy?).to be false
    end

    it "allows admins" do
      expect(GenrePolicy.new(admin, genre).destroy?).to be true
    end
  end
end
