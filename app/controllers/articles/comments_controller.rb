module Articles
  class CommentsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_article

    def create
      @comment = @article.comments.build(comment_params)
      @comment.user = current_user
      authorize @comment
      if @comment.save
        redirect_to @article, notice: "Комментарий добавлен."
      else
        redirect_to @article, alert: "Не удалось добавить комментарий."
      end
    end

    def destroy
      @comment = @article.comments.find(params[:id])
      authorize @comment
      @comment.destroy
      redirect_to @article, notice: "Комментарий удалён."
    end

    private

    def set_article
      @article = Article.find(params[:article_id])
    end

    def comment_params
      params.require(:comment).permit(:body)
    end
  end
end
