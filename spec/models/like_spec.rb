require 'rails_helper'

RSpec.describe Like, type: :model do
  describe "associations" do
    it { should belong_to(:user) }
    it { should belong_to(:likeable) }
  end

  describe "validations" do
    it "prevents duplicate likes" do
      article = create(:article)
      user = create(:user)
      create(:like, user: user, likeable: article)
      duplicate = build(:like, user: user, likeable: article)
      expect(duplicate).not_to be_valid
    end
  end
end
