class ReviewsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_game
  before_action :set_review, only: [ :edit, :update, :destroy ]

  def new
    @review = @game.reviews.build
    authorize @review
  end

  def create
    @review = @game.reviews.build(review_params)
    @review.user = current_user
    authorize @review
    if @review.save
      redirect_to @game, notice: "Отзыв успешно добавлен."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    authorize @review
  end

  def update
    authorize @review
    if @review.update(review_params)
      redirect_to @game, notice: "Отзыв обновлён."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @review
    @review.destroy
    redirect_to @game, notice: "Отзыв удалён."
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
end
