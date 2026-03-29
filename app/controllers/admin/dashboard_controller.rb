module Admin
  class DashboardController < ApplicationController
    before_action :authenticate_user!
    before_action :require_admin

    def index
      @users_count = User.count
      @games_count = Game.count
      @articles_count = Article.count
      @reviews_count = Review.count
      @comments_count = Comment.count
      @recent_users = User.order(created_at: :desc).limit(5)
      @recent_reviews = Review.includes(:user, :game).order(created_at: :desc).limit(5)
    end

    private

    def require_admin
      unless current_user.admin?
        redirect_to root_path, alert: "Доступ запрещён."
      end
    end
  end
end
