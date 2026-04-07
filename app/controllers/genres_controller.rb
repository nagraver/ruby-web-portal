class GenresController < ApplicationController
  before_action :authenticate_user!
  before_action :set_genre, only: [ :edit, :update, :destroy ]

  def index
    @genres = Genre.sorted.page(params[:page]).per(20)
    authorize Genre
  end

  def new
    @genre = Genre.new
    authorize @genre
  end

  def create
    @genre = Genre.new(genre_params)
    authorize @genre
    if @genre.save
      redirect_to genres_path, notice: "Жанр создан."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    authorize @genre
  end

  def update
    authorize @genre
    if @genre.update(genre_params)
      redirect_to genres_path, notice: "Жанр обновлён."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @genre
    @genre.destroy
    redirect_to genres_path, notice: "Жанр удалён."
  end

  private

  def set_genre
    @genre = Genre.find(params[:id])
  end

  def genre_params
    params.require(:genre).permit(:name)
  end
end
