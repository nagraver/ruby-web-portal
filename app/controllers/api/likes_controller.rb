module Api
  class LikesController < BaseController
    before_action :require_authenticated!
    before_action :set_article

    def create
      like = @article.likes.build(user: current_user)
      if like.save
        render json: { liked: true, likes_count: @article.likes.count }, status: :created
      else
        render json: { errors: like.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      like = @article.likes.find_by!(user: current_user)
      like.destroy
      render json: { liked: false, likes_count: @article.likes.count }
    end

    private

    def set_article
      @article = Article.find(params[:article_id])
    end
  end
end
