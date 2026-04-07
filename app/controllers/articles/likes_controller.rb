module Articles
  class LikesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_article

    def create
      @like = @article.likes.build(user: current_user)
      if @like.save
        redirect_to @article, notice: "Вам понравилась статья."
      else
        redirect_to @article, alert: "Не удалось поставить лайк."
      end
    end

    def destroy
      @like = @article.likes.find_by!(user: current_user)
      @like.destroy
      redirect_to @article, notice: "Лайк убран."
    end

    private

    def set_article
      @article = Article.find(params[:article_id])
    end
  end
end
