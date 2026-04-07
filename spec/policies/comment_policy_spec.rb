require 'rails_helper'

RSpec.describe CommentPolicy, type: :policy do
  let(:user) { create(:user) }
  let(:admin) { create(:user, :admin) }
  let(:other_user) { create(:user) }
  let(:comment) { create(:comment, :on_article, user: user) }

  describe "create?" do
    it "allows authenticated users" do
      expect(CommentPolicy.new(user, Comment.new).create?).to be true
    end

    it "denies guests" do
      expect(CommentPolicy.new(nil, Comment.new).create?).to be false
    end
  end

  describe "destroy?" do
    it "allows comment author" do
      expect(CommentPolicy.new(user, comment).destroy?).to be true
    end

    it "allows admins" do
      expect(CommentPolicy.new(admin, comment).destroy?).to be true
    end

    it "denies other users" do
      expect(CommentPolicy.new(other_user, comment).destroy?).to be false
    end
  end
end
