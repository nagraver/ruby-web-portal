class ProfilesController < ApplicationController
  def show
    @user = User.find_by!(username: params[:username])
    @reviews = @user.reviews.includes(:game).recent.limit(5)
    @comments = @user.comments.includes(:commentable).order(created_at: :desc).limit(10)
    @articles = @user.articles.published.recent.limit(5) if @user.admin?
  end
end
