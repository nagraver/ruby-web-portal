require 'rails_helper'

RSpec.describe "API Likes", type: :request do
  let(:user) { create(:user) }
  let(:article) { create(:article) }
  let(:json_headers) { { "Accept" => "application/json", "Content-Type" => "application/json" } }

  describe "POST /api/articles/:article_id/like" do
    context "as authenticated user" do
      before { sign_in user }

      it "likes an article" do
        expect {
          post "/api/articles/#{article.id}/like", headers: json_headers
        }.to change(Like, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["liked"]).to be true
        expect(json["likes_count"]).to eq(1)
      end

      it "prevents duplicate likes" do
        create(:like, user: user, likeable: article)

        expect {
          post "/api/articles/#{article.id}/like", headers: json_headers
        }.not_to change(Like, :count)

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "as guest" do
      it "returns unauthorized" do
        post "/api/articles/#{article.id}/like", headers: json_headers
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/articles/:article_id/like" do
    context "as authenticated user who liked the article" do
      before do
        sign_in user
        create(:like, user: user, likeable: article)
      end

      it "removes the like" do
        expect {
          delete "/api/articles/#{article.id}/like", headers: json_headers
        }.to change(Like, :count).by(-1)

        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json["liked"]).to be false
        expect(json["likes_count"]).to eq(0)
      end
    end

    context "as user who has not liked the article" do
      before { sign_in user }

      it "returns not found" do
        delete "/api/articles/#{article.id}/like", headers: json_headers
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
