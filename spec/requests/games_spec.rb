require 'rails_helper'

RSpec.describe "API Games", type: :request do
  let(:admin) { create(:user, :admin) }
  let(:user) { create(:user) }
  let!(:game) { create(:game) }
  let(:json_headers) { { "Accept" => "application/json", "Content-Type" => "application/json" } }

  describe "GET /api/games" do
    it "returns success" do
      get "/api/games", headers: json_headers
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json["games"].length).to be >= 1
    end

    it "paginates results" do
      create_list(:game, 15)
      get "/api/games", headers: json_headers
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json["meta"]["total_pages"]).to be >= 1
    end

    it "filters by genre" do
      genre = create(:genre)
      create(:game_genre, game: game, genre: genre)
      get "/api/games", params: { genre_id: genre.id }, headers: json_headers
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json["games"].map { |g| g["id"] }).to include(game.id)
    end

    it "searches by title" do
      get "/api/games", params: { q: game.title[0..5] }, headers: json_headers
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /api/games/:id" do
    it "returns success" do
      get "/api/games/#{game.id}", headers: json_headers
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json["game"]["title"]).to eq(game.title)
    end
  end

  describe "POST /api/games" do
    context "as admin" do
      before { sign_in admin }

      it "creates a game" do
        expect {
          post "/api/games", params: { game: { title: "New Game", description: "Desc" } }.to_json, headers: json_headers
        }.to change(Game, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context "as regular user" do
      before { sign_in user }

      it "denies access" do
        post "/api/games", params: { game: { title: "New Game" } }.to_json, headers: json_headers
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "PATCH /api/games/:id" do
    context "as admin" do
      before { sign_in admin }

      it "updates the game" do
        patch "/api/games/#{game.id}", params: { game: { title: "Updated" } }.to_json, headers: json_headers
        expect(game.reload.title).to eq("Updated")
      end
    end
  end

  describe "DELETE /api/games/:id" do
    context "as admin" do
      before { sign_in admin }

      it "deletes the game" do
        expect {
          delete "/api/games/#{game.id}", headers: json_headers
        }.to change(Game, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
