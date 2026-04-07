require 'rails_helper'

RSpec.describe "User Flows (Integration)", type: :request do
  let(:json_headers) { { "Accept" => "application/json", "Content-Type" => "application/json" } }

  describe "Registration -> Login -> Profile flow" do
    it "allows a user to register, check profile, and log out" do
      post "/api/auth/sign_up", params: {
        user: {
          username: "gamer42",
          email: "gamer42@example.com",
          password: "securepass",
          password_confirmation: "securepass"
        }
      }.to_json, headers: json_headers

      expect(response).to have_http_status(:created)
      user_data = JSON.parse(response.body)["user"]
      expect(user_data["username"]).to eq("gamer42")

      get "/api/auth/me", headers: json_headers
      expect(JSON.parse(response.body)["user"]["id"]).to eq(user_data["id"])

      get "/api/profiles/gamer42", headers: json_headers
      expect(response).to have_http_status(:success)
      profile = JSON.parse(response.body)
      expect(profile["user"]["username"]).to eq("gamer42")
      expect(profile["stats"]["reviews_count"]).to eq(0)

      delete "/api/auth/sign_out", headers: json_headers
      expect(response).to have_http_status(:success)

      get "/api/auth/me", headers: json_headers
      expect(JSON.parse(response.body)["user"]).to be_nil
    end
  end

  describe "Admin game management flow" do
    let(:admin) { create(:user, :admin) }

    before { sign_in admin }

    it "allows admin to create a game, add genre, and manage it" do
      post "/api/genres", params: { genre: { name: "RPG" } }.to_json, headers: json_headers
      expect(response).to have_http_status(:created)
      genre_id = JSON.parse(response.body)["genre"]["id"]

      post "/api/games", params: {
        game: {
          title: "Epic Quest",
          description: "A grand adventure",
          developer: "Dev Studio",
          publisher: "Publisher Inc",
          genre_ids: [ genre_id ]
        }
      }.to_json, headers: json_headers
      expect(response).to have_http_status(:created)
      game_id = JSON.parse(response.body)["game"]["id"]

      get "/api/games/#{game_id}", headers: json_headers
      expect(response).to have_http_status(:success)
      game = JSON.parse(response.body)["game"]
      expect(game["title"]).to eq("Epic Quest")
      expect(game["genres"].first["name"]).to eq("RPG")

      patch "/api/games/#{game_id}", params: {
        game: { title: "Epic Quest II" }
      }.to_json, headers: json_headers
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)["game"]["title"]).to eq("Epic Quest II")
    end
  end

  describe "Review and rating flow" do
    let(:user) { create(:user) }
    let(:game) { create(:game) }

    before { sign_in user }

    it "user reviews a game and rating updates" do
      post "/api/games/#{game.id}/reviews", params: {
        review: { title: "Amazing!", body: "Best game ever", rating: 9 }
      }.to_json, headers: json_headers
      expect(response).to have_http_status(:created)

      get "/api/games/#{game.id}", headers: json_headers
      game_data = JSON.parse(response.body)["game"]
      expect(game_data["average_rating"].to_f).to eq(9.0)

      review_id = JSON.parse(response.body)["reviews"].first["id"]

      patch "/api/games/#{game.id}/reviews/#{review_id}", params: {
        review: { rating: 7 }
      }.to_json, headers: json_headers
      expect(response).to have_http_status(:success)

      get "/api/games/#{game.id}", headers: json_headers
      expect(JSON.parse(response.body)["game"]["average_rating"].to_f).to eq(7.0)
    end

    it "prevents duplicate reviews on the same game" do
      create(:review, user: user, game: game)

      post "/api/games/#{game.id}/reviews", params: {
        review: { title: "Again", body: "Another", rating: 5 }
      }.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "Article with comments and likes flow" do
    let(:admin) { create(:user, :admin) }
    let(:user) { create(:user) }

    it "admin creates article, user comments and likes" do
      sign_in admin
      post "/api/articles", params: {
        article: { title: "New Release", body: "Check out this game!", published_at: Time.current }
      }.to_json, headers: json_headers
      expect(response).to have_http_status(:created)
      article_id = JSON.parse(response.body)["article"]["id"]

      sign_out admin
      sign_in user

      post "/api/articles/#{article_id}/comments",
        params: { comment: { body: "Great news!" } }.to_json,
        headers: json_headers
      expect(response).to have_http_status(:created)

      post "/api/articles/#{article_id}/like", headers: json_headers
      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["likes_count"]).to eq(1)

      get "/api/articles/#{article_id}", headers: json_headers
      article_data = JSON.parse(response.body)
      expect(article_data["article"]["likes_count"]).to eq(1)
      expect(article_data["article"]["liked_by_user"]).to be true
      expect(article_data["comments"].length).to eq(1)
    end
  end

  describe "Home page data" do
    it "aggregates articles and games for the home page" do
      create_list(:article, 3, published_at: 1.hour.ago)
      create_list(:game, 3, average_rating: 8.0)

      get "/api/home", headers: json_headers
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)

      expect(json["latest_articles"].length).to eq(3)
      expect(json["top_games"].length).to eq(3)
      expect(json["recent_games"].length).to eq(3)
    end
  end

  describe "Pagination" do
    it "paginates game listings" do
      create_list(:game, 15)

      get "/api/games", params: { per_page: 5, page: 1 }, headers: json_headers
      json = JSON.parse(response.body)
      expect(json["games"].length).to eq(5)
      expect(json["meta"]["total_pages"]).to eq(3)
      expect(json["meta"]["current_page"]).to eq(1)

      get "/api/games", params: { per_page: 5, page: 2 }, headers: json_headers
      json = JSON.parse(response.body)
      expect(json["games"].length).to eq(5)
      expect(json["meta"]["current_page"]).to eq(2)
    end
  end

  describe "Authorization boundaries" do
    let(:user) { create(:user) }
    let(:admin) { create(:user, :admin) }
    let(:game) { create(:game) }
    let(:article) { create(:article) }

    it "regular user cannot create games" do
      sign_in user
      post "/api/games", params: { game: { title: "Hack" } }.to_json, headers: json_headers
      expect(response).to have_http_status(:forbidden)
    end

    it "regular user cannot create articles" do
      sign_in user
      post "/api/articles", params: { article: { title: "Hack", body: "Body" } }.to_json, headers: json_headers
      expect(response).to have_http_status(:forbidden)
    end

    it "regular user cannot access admin dashboard" do
      sign_in user
      get "/api/admin/dashboard", headers: json_headers
      expect(response).to have_http_status(:forbidden)
    end

    it "admin can access admin dashboard" do
      sign_in admin
      get "/api/admin/dashboard", headers: json_headers
      expect(response).to have_http_status(:success)
    end

    it "guest cannot review games" do
      post "/api/games/#{game.id}/reviews", params: {
        review: { title: "Test", body: "Test", rating: 5 }
      }.to_json, headers: json_headers
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
