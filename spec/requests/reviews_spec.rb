require 'rails_helper'

RSpec.describe "API Reviews", type: :request do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:json_headers) { { "Accept" => "application/json", "Content-Type" => "application/json" } }

  describe "POST /api/games/:game_id/reviews" do
    context "as authenticated user" do
      before { sign_in user }

      it "creates a review" do
        expect {
          post "/api/games/#{game.id}/reviews", params: {
            review: { title: "Great game", body: "Loved it", rating: 9 }
          }.to_json, headers: json_headers
        }.to change(Review, :count).by(1)
        expect(response).to have_http_status(:created)
      end

      it "prevents duplicate reviews" do
        create(:review, user: user, game: game)
        expect {
          post "/api/games/#{game.id}/reviews", params: {
            review: { title: "Again", body: "Another", rating: 5 }
          }.to_json, headers: json_headers
        }.not_to change(Review, :count)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "as guest" do
      it "returns unauthorized" do
        post "/api/games/#{game.id}/reviews", params: {
          review: { title: "Test", body: "Test", rating: 5 }
        }.to_json, headers: json_headers
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/games/:game_id/reviews/:id" do
    let!(:review) { create(:review, user: user, game: game) }

    context "as author" do
      before { sign_in user }

      it "deletes the review" do
        expect {
          delete "/api/games/#{game.id}/reviews/#{review.id}", headers: json_headers
        }.to change(Review, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
