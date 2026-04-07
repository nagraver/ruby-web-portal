require 'rails_helper'

RSpec.describe "API Admin Dashboard", type: :request do
  let(:admin) { create(:user, :admin) }
  let(:user) { create(:user) }
  let(:json_headers) { { "Accept" => "application/json" } }

  describe "GET /api/admin/dashboard" do
    context "as admin" do
      before do
        sign_in admin
        create_list(:game, 3)
        create(:article)
        create(:review)
      end

      it "returns dashboard statistics" do
        get "/api/admin/dashboard", headers: json_headers
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)

        expect(json).to have_key("users_count")
        expect(json).to have_key("games_count")
        expect(json).to have_key("articles_count")
        expect(json).to have_key("reviews_count")
        expect(json).to have_key("comments_count")
        expect(json).to have_key("likes_count")
        expect(json).to have_key("recent_users")
        expect(json).to have_key("recent_reviews")
        expect(json).to have_key("recent_articles")
        expect(json).to have_key("top_games")
        expect(json).to have_key("weekly_activity")
        expect(json["games_count"]).to eq(Game.count)
      end

      it "includes recent users with details" do
        get "/api/admin/dashboard", headers: json_headers
        json = JSON.parse(response.body)

        expect(json["recent_users"]).to be_an(Array)
        expect(json["recent_users"].first).to have_key("username")
        expect(json["recent_users"].first).to have_key("role")
      end

      it "includes weekly activity data" do
        get "/api/admin/dashboard", headers: json_headers
        json = JSON.parse(response.body)

        expect(json["weekly_activity"]).to be_an(Array)
        expect(json["weekly_activity"].length).to eq(8)
        expect(json["weekly_activity"].first).to have_key("reviews")
        expect(json["weekly_activity"].first).to have_key("comments")
        expect(json["weekly_activity"].first).to have_key("users")
      end

      it "includes top rated games" do
        get "/api/admin/dashboard", headers: json_headers
        json = JSON.parse(response.body)

        expect(json["top_games"]).to be_an(Array)
      end
    end

    context "as regular user" do
      before { sign_in user }

      it "denies access" do
        get "/api/admin/dashboard", headers: json_headers
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "as guest" do
      it "returns unauthorized" do
        get "/api/admin/dashboard", headers: json_headers
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
