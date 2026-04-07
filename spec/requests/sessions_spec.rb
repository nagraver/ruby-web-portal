require 'rails_helper'

RSpec.describe "API Sessions", type: :request do
  let(:user) { create(:user, email: "test@example.com", password: "password123") }
  let(:json_headers) { { "Accept" => "application/json", "Content-Type" => "application/json" } }

  describe "POST /api/auth/sign_in" do
    it "signs in with valid credentials" do
      post "/api/auth/sign_in", params: {
        user: { email: user.email, password: "password123" }
      }.to_json, headers: json_headers

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json["user"]["email"]).to eq(user.email)
      expect(json["user"]["username"]).to eq(user.username)
    end

    it "rejects invalid password" do
      post "/api/auth/sign_in", params: {
        user: { email: user.email, password: "wrong" }
      }.to_json, headers: json_headers

      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects non-existent email" do
      post "/api/auth/sign_in", params: {
        user: { email: "no@example.com", password: "password123" }
      }.to_json, headers: json_headers

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /api/auth/me" do
    context "when signed in" do
      before { sign_in user }

      it "returns the current user" do
        get "/api/auth/me", headers: json_headers
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json["user"]["id"]).to eq(user.id)
        expect(json["user"]["role"]).to eq("user")
      end
    end

    context "when not signed in" do
      it "returns null user" do
        get "/api/auth/me", headers: json_headers
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json["user"]).to be_nil
      end
    end
  end

  describe "DELETE /api/auth/sign_out" do
    before { sign_in user }

    it "signs out the user" do
      delete "/api/auth/sign_out", headers: json_headers
      expect(response).to have_http_status(:success)

      get "/api/auth/me", headers: json_headers
      json = JSON.parse(response.body)
      expect(json["user"]).to be_nil
    end
  end
end
