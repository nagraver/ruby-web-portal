require 'rails_helper'

RSpec.describe ArticlePolicy, type: :policy do
  let(:user) { create(:user) }
  let(:admin) { create(:user, :admin) }
  let(:article) { create(:article) }

  describe "create?" do
    it "denies regular users" do
      expect(ArticlePolicy.new(user, article).create?).to be false
    end

    it "allows admins" do
      expect(ArticlePolicy.new(admin, article).create?).to be true
    end
  end

  describe "update?" do
    it "denies regular users" do
      expect(ArticlePolicy.new(user, article).update?).to be false
    end

    it "allows admins" do
      expect(ArticlePolicy.new(admin, article).update?).to be true
    end
  end

  describe "destroy?" do
    it "denies regular users" do
      expect(ArticlePolicy.new(user, article).destroy?).to be false
    end

    it "allows admins" do
      expect(ArticlePolicy.new(admin, article).destroy?).to be true
    end
  end
end
