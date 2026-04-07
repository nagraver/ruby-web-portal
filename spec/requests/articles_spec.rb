require 'rails_helper'

RSpec.describe "API Articles", type: :request do
  let(:admin) { create(:user, :admin) }
  let(:user) { create(:user) }
  let!(:article) { create(:article) }
  let(:json_headers) { { "Accept" => "application/json", "Content-Type" => "application/json" } }

  describe "GET /api/articles" do
    it "returns success" do
      get "/api/articles", headers: json_headers
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json).to have_key("articles")
    end
  end

  describe "GET /api/articles/:id" do
    it "returns success" do
      get "/api/articles/#{article.id}", headers: json_headers
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json["article"]["title"]).to eq(article.title)
    end
  end

  describe "POST /api/articles" do
    context "as admin" do
      before { sign_in admin }

      it "creates an article" do
        expect {
          post "/api/articles", params: {
            article: { title: "News", body: "Content", published_at: Time.current }
          }.to_json, headers: json_headers
        }.to change(Article, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context "as regular user" do
      before { sign_in user }

      it "denies access" do
        post "/api/articles", params: { article: { title: "News", body: "Content" } }.to_json, headers: json_headers
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "DELETE /api/articles/:id" do
    context "as admin" do
      before { sign_in admin }

      it "deletes the article" do
        expect {
          delete "/api/articles/#{article.id}", headers: json_headers
        }.to change(Article, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
