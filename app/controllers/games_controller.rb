class GamesController < ApplicationController
  before_action :authenticate_user!, except: [ :index, :show ]
  before_action :set_game, only: [ :show, :edit, :update, :destroy ]

  def index
    @games = Game.includes(:genres)
    @games = @games.by_genre(params[:genre_id]) if params[:genre_id].present?
    @games = @games.where("title ILIKE ?", "%#{params[:q]}%") if params[:q].present?
    @games = @games.order(created_at: :desc).page(params[:page]).per(12)
    @genres = Genre.sorted
  end

  def show
    @reviews = @game.reviews.includes(:user).order(created_at: :desc).page(params[:page]).per(10)
  end

  def new
    @game = Game.new
    authorize @game
    @genres = Genre.sorted
  end

  def create
    @game = Game.new(game_params)
    authorize @game
    if @game.save
      redirect_to @game, notice: "Игра успешно добавлена."
    else
      @genres = Genre.sorted
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    authorize @game
    @genres = Genre.sorted
  end

  def update
    authorize @game
    if @game.update(game_params)
      redirect_to @game, notice: "Игра успешно обновлена."
    else
      @genres = Genre.sorted
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @game
    @game.destroy
    redirect_to games_path, notice: "Игра удалена."
  end

  private

  def set_game
    @game = Game.find(params[:id])
  end

  def game_params
    params.require(:game).permit(:title, :description, :developer, :publisher,
                                 :release_date, :cover_image, genre_ids: [])
  end
end
