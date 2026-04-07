module Api
  class ReviewsController < BaseController
    before_action :require_authenticated!
    before_action :set_game
    before_action :set_review, only: [ :update, :destroy ]

    def create
      review = @game.reviews.build(review_params)
      review.user = current_user
      authorize review
      if review.save
        render json: { review: review_json(review) }, status: :created
      else
        render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      authorize @review
      if @review.update(review_params)
        render json: { review: review_json(@review) }
      else
        render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      authorize @review
      @review.destroy
      head :no_content
    end

    private

    def set_game
      @game = Game.find(params[:game_id])
    end

    def set_review
      @review = @game.reviews.find(params[:id])
    end

    def review_params
      params.require(:review).permit(:title, :body, :rating)
    end

    def review_json(r)
      {
        id: r.id, title: r.title, body: r.body, rating: r.rating,
        user_id: r.user_id, username: r.user.username,
        game_id: r.game_id, created_at: r.created_at
      }
    end
  end
end
