require 'rails_helper'

RSpec.describe "API Registrations", type: :request do
  let(:json_headers) { { "Accept" => "application/json", "Content-Type" => "application/json" } }

  describe "POST /api/auth/sign_up" do
    it "creates a new user with valid data" do
      expect {
        post "/api/auth/sign_up", params: {
          user: {
            username: "newplayer",
            email: "new@example.com",
            password: "password123",
            password_confirmation: "password123"
          }
        }.to_json, headers: json_headers
      }.to change(User, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["user"]["username"]).to eq("newplayer")
      expect(json["user"]["role"]).to eq("user")
    end

    it "rejects duplicate email" do
      create(:user, email: "taken@example.com")
      post "/api/auth/sign_up", params: {
        user: {
          username: "another_user",
          email: "taken@example.com",
          password: "password123",
          password_confirmation: "password123"
        }
      }.to_json, headers: json_headers

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]).to be_present
    end

    it "rejects duplicate username" do
      create(:user, username: "taken_name")
      post "/api/auth/sign_up", params: {
        user: {
          username: "taken_name",
          email: "unique@example.com",
          password: "password123",
          password_confirmation: "password123"
        }
      }.to_json, headers: json_headers

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "rejects short username" do
      post "/api/auth/sign_up", params: {
        user: {
          username: "ab",
          email: "short@example.com",
          password: "password123",
          password_confirmation: "password123"
        }
      }.to_json, headers: json_headers

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "rejects mismatched passwords" do
      post "/api/auth/sign_up", params: {
        user: {
          username: "newplayer",
          email: "new@example.com",
          password: "password123",
          password_confirmation: "different"
        }
      }.to_json, headers: json_headers

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH /api/auth/me" do
    let(:user) { create(:user, password: "password123") }

    context "when authenticated" do
      before { sign_in user }

      it "updates username with correct current password" do
        patch "/api/auth/me", params: {
          user: { username: "updated_name", current_password: "password123" }
        }.to_json, headers: json_headers

        expect(response).to have_http_status(:success)
        expect(user.reload.username).to eq("updated_name")
      end

      it "rejects update with wrong current password" do
        patch "/api/auth/me", params: {
          user: { username: "hacked", current_password: "wrong" }
        }.to_json, headers: json_headers

        expect(response).to have_http_status(:unprocessable_entity)
        expect(user.reload.username).not_to eq("hacked")
      end
    end

    context "when not authenticated" do
      it "returns unauthorized" do
        patch "/api/auth/me", params: {
          user: { username: "hacked", current_password: "whatever" }
        }.to_json, headers: json_headers

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
