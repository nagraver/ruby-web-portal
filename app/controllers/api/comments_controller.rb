module Api
  class CommentsController < BaseController
    before_action :require_authenticated!
    before_action :set_commentable

    def create
      comment = @commentable.comments.build(comment_params)
      comment.user = current_user
      authorize comment
      if comment.save
        render json: { comment: comment_json(comment) }, status: :created
      else
        render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      comment = @commentable.comments.find(params[:id])
      authorize comment
      comment.destroy
      head :no_content
    end

    private

    def set_commentable
      if params[:article_id]
        @commentable = Article.find(params[:article_id])
      elsif params[:review_id]
        game = Game.find(params[:game_id])
        @commentable = game.reviews.find(params[:review_id])
      end
    end

    def comment_params
      params.require(:comment).permit(:body)
    end

    def comment_json(c)
      { id: c.id, body: c.body, user_id: c.user_id, username: c.user.username, created_at: c.created_at }
    end
  end
end
