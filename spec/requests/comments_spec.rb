require 'rails_helper'

RSpec.describe "API Comments", type: :request do
  let(:user) { create(:user) }
  let(:admin) { create(:user, :admin) }
  let(:article) { create(:article) }
  let(:game) { create(:game) }
  let(:review) { create(:review, game: game) }
  let(:json_headers) { { "Accept" => "application/json", "Content-Type" => "application/json" } }

  describe "POST /api/articles/:article_id/comments" do
    context "as authenticated user" do
      before { sign_in user }

      it "creates a comment on an article" do
        expect {
          post "/api/articles/#{article.id}/comments",
            params: { comment: { body: "Great article!" } }.to_json,
            headers: json_headers
        }.to change(Comment, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["comment"]["body"]).to eq("Great article!")
        expect(json["comment"]["username"]).to eq(user.username)
      end

      it "rejects empty body" do
        post "/api/articles/#{article.id}/comments",
          params: { comment: { body: "" } }.to_json,
          headers: json_headers

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "as guest" do
      it "returns unauthorized" do
        post "/api/articles/#{article.id}/comments",
          params: { comment: { body: "Test" } }.to_json,
          headers: json_headers

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/articles/:article_id/comments/:id" do
    let!(:comment) { create(:comment, user: user, commentable: article) }

    context "as comment author" do
      before { sign_in user }

      it "deletes the comment" do
        expect {
          delete "/api/articles/#{article.id}/comments/#{comment.id}", headers: json_headers
        }.to change(Comment, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context "as admin" do
      before { sign_in admin }

      it "can delete any comment" do
        expect {
          delete "/api/articles/#{article.id}/comments/#{comment.id}", headers: json_headers
        }.to change(Comment, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context "as another user" do
      let(:other_user) { create(:user) }
      before { sign_in other_user }

      it "denies access" do
        delete "/api/articles/#{article.id}/comments/#{comment.id}", headers: json_headers
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "POST /api/games/:game_id/reviews/:review_id/comments" do
    before { sign_in user }

    it "creates a comment on a review" do
      expect {
        post "/api/games/#{game.id}/reviews/#{review.id}/comments",
          params: { comment: { body: "I agree!" } }.to_json,
          headers: json_headers
      }.to change(Comment, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end

  describe "DELETE /api/games/:game_id/reviews/:review_id/comments/:id" do
    let!(:comment) { create(:comment, user: user, commentable: review) }

    before { sign_in user }

    it "deletes the comment" do
      expect {
        delete "/api/games/#{game.id}/reviews/#{review.id}/comments/#{comment.id}", headers: json_headers
      }.to change(Comment, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
