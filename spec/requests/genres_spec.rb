require 'rails_helper'

RSpec.describe "API Genres", type: :request do
  let(:admin) { create(:user, :admin) }
  let(:user) { create(:user) }
  let!(:genre) { create(:genre) }
  let(:json_headers) { { "Accept" => "application/json", "Content-Type" => "application/json" } }

  describe "GET /api/genres" do
    it "returns all genres sorted by name" do
      z_genre = create(:genre, name: "Zzz-genre")
      get "/api/genres", headers: json_headers
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json["genres"].length).to be >= 2
    end

    it "does not require authentication" do
      get "/api/genres", headers: json_headers
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /api/genres/:id" do
    it "returns a genre" do
      get "/api/genres/#{genre.id}", headers: json_headers
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json["genre"]["name"]).to eq(genre.name)
    end

    it "returns 404 for non-existent genre" do
      get "/api/genres/99999", headers: json_headers
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/genres" do
    context "as admin" do
      before { sign_in admin }

      it "creates a genre" do
        expect {
          post "/api/genres", params: { genre: { name: "New Genre" } }.to_json, headers: json_headers
        }.to change(Genre, :count).by(1)
        expect(response).to have_http_status(:created)
      end

      it "rejects duplicate names" do
        post "/api/genres", params: { genre: { name: genre.name } }.to_json, headers: json_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "rejects blank names" do
        post "/api/genres", params: { genre: { name: "" } }.to_json, headers: json_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "as regular user" do
      before { sign_in user }

      it "denies access" do
        post "/api/genres", params: { genre: { name: "New" } }.to_json, headers: json_headers
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "as guest" do
      it "returns unauthorized" do
        post "/api/genres", params: { genre: { name: "New" } }.to_json, headers: json_headers
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH /api/genres/:id" do
    context "as admin" do
      before { sign_in admin }

      it "updates the genre" do
        patch "/api/genres/#{genre.id}", params: { genre: { name: "Updated" } }.to_json, headers: json_headers
        expect(response).to have_http_status(:success)
        expect(genre.reload.name).to eq("Updated")
      end
    end

    context "as regular user" do
      before { sign_in user }

      it "denies access" do
        patch "/api/genres/#{genre.id}", params: { genre: { name: "Hacked" } }.to_json, headers: json_headers
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "DELETE /api/genres/:id" do
    context "as admin" do
      before { sign_in admin }

      it "deletes the genre" do
        expect {
          delete "/api/genres/#{genre.id}", headers: json_headers
        }.to change(Genre, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context "as regular user" do
      before { sign_in user }

      it "denies access" do
        delete "/api/genres/#{genre.id}", headers: json_headers
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
