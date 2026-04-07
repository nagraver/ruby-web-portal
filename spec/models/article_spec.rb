require 'rails_helper'

RSpec.describe Article, type: :model do
  describe "associations" do
    it { should belong_to(:user) }
    it { should belong_to(:game).optional }
    it { should have_many(:comments).dependent(:destroy) }
    it { should have_many(:likes).dependent(:destroy) }
  end

  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:body) }
  end

  describe "scopes" do
    let!(:published) { create(:article, published_at: 1.hour.ago) }
    let!(:draft) { create(:article, :draft) }
    let!(:future) { create(:article, published_at: 1.day.from_now) }

    it ".published returns only published articles" do
      expect(Article.published).to include(published)
      expect(Article.published).not_to include(draft)
      expect(Article.published).not_to include(future)
    end

    it ".drafts returns only drafts" do
      expect(Article.drafts).to include(draft)
      expect(Article.drafts).not_to include(published)
    end
  end

  describe "#published?" do
    it "returns true for published articles" do
      article = build(:article, published_at: 1.hour.ago)
      expect(article.published?).to be true
    end

    it "returns false for drafts" do
      article = build(:article, :draft)
      expect(article.published?).to be false
    end
  end

  describe "#liked_by?" do
    let(:article) { create(:article) }
    let(:user) { create(:user) }

    it "returns true when user liked" do
      create(:like, user: user, likeable: article)
      expect(article.liked_by?(user)).to be true
    end

    it "returns false when user has not liked" do
      expect(article.liked_by?(user)).to be false
    end

    it "returns false for nil user" do
      expect(article.liked_by?(nil)).to be false
    end
  end
end
