require 'rails_helper'

RSpec.describe GamePolicy, type: :policy do
  let(:user) { create(:user) }
  let(:admin) { create(:user, :admin) }
  let(:game) { create(:game) }

  describe "index?" do
    it "allows everyone" do
      expect(GamePolicy.new(nil, game).index?).to be true
    end
  end

  describe "show?" do
    it "allows everyone" do
      expect(GamePolicy.new(nil, game).show?).to be true
    end
  end

  describe "create?" do
    it "denies regular users" do
      expect(GamePolicy.new(user, game).create?).to be false
    end

    it "allows admins" do
      expect(GamePolicy.new(admin, game).create?).to be true
    end
  end

  describe "update?" do
    it "denies regular users" do
      expect(GamePolicy.new(user, game).update?).to be false
    end

    it "allows admins" do
      expect(GamePolicy.new(admin, game).update?).to be true
    end
  end

  describe "destroy?" do
    it "denies regular users" do
      expect(GamePolicy.new(user, game).destroy?).to be false
    end

    it "allows admins" do
      expect(GamePolicy.new(admin, game).destroy?).to be true
    end
  end
end
