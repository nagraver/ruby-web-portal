module Reviews
  class CommentsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_review

    def create
      @comment = @review.comments.build(comment_params)
      @comment.user = current_user
      authorize @comment
      if @comment.save
        redirect_to game_path(@review.game), notice: "Комментарий добавлен."
      else
        redirect_to game_path(@review.game), alert: "Не удалось добавить комментарий."
      end
    end

    def destroy
      @comment = @review.comments.find(params[:id])
      authorize @comment
      @comment.destroy
      redirect_to game_path(@review.game), notice: "Комментарий удалён."
    end

    private

    def set_review
      @game = Game.find(params[:game_id])
      @review = @game.reviews.find(params[:review_id])
    end

    def comment_params
      params.require(:comment).permit(:body)
    end
  end
end
