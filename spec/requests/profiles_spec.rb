require 'rails_helper'

RSpec.describe "API Profiles", type: :request do
  let(:user) { create(:user) }
  let(:json_headers) { { "Accept" => "application/json" } }

  describe "GET /api/profiles/:username" do
    it "shows user profile" do
      get "/api/profiles/#{user.username}", headers: json_headers
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json["user"]["username"]).to eq(user.username)
    end

    it "returns 404 for unknown user" do
      get "/api/profiles/nonexistent_user", headers: json_headers
      expect(response).to have_http_status(:not_found)
    end
  end
end
