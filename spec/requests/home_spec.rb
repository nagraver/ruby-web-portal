require 'rails_helper'

RSpec.describe "Home", type: :request do
  describe "GET /" do
    it "returns success" do
      get root_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /api/home" do
    it "returns JSON with articles and games" do
      create(:article, published_at: 1.hour.ago)
      create(:game, average_rating: 9.0)
      get "/api/home", headers: { "Accept" => "application/json" }
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json).to have_key("latest_articles")
      expect(json).to have_key("top_games")
      expect(json).to have_key("recent_games")
    end
  end
end
