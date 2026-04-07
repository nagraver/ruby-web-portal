require 'rails_helper'

RSpec.describe User, type: :model do
  describe "associations" do
    it { should have_many(:articles).dependent(:destroy) }
    it { should have_many(:reviews).dependent(:destroy) }
    it { should have_many(:comments).dependent(:destroy) }
    it { should have_many(:likes).dependent(:destroy) }
  end

  describe "validations" do
    subject { build(:user) }

    it { should validate_presence_of(:username) }
    it { should validate_uniqueness_of(:username).case_insensitive }
    it { should validate_length_of(:username).is_at_least(3).is_at_most(30) }
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:password) }
  end

  describe "roles" do
    it "defaults to user role" do
      user = create(:user)
      expect(user.role).to eq("user")
    end

    it "can be admin" do
      admin = create(:user, :admin)
      expect(admin.admin?).to be true
    end
  end

  describe "username format" do
    it "rejects usernames with special characters" do
      user = build(:user, username: "user@name!")
      expect(user).not_to be_valid
    end

    it "accepts usernames with underscores" do
      user = build(:user, username: "valid_user_123")
      expect(user).to be_valid
    end
  end
end
