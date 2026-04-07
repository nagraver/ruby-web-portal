module Api
  class GenresController < BaseController
    before_action :require_authenticated!, except: [ :index, :show ]
    before_action :set_genre, only: [ :show, :update, :destroy ]

    def index
      genres = Genre.sorted
      render json: { genres: genres.map { |g| genre_json(g) } }
    end

    def show
      render json: { genre: genre_json(@genre) }
    end

    def create
      genre = Genre.new(genre_params)
      authorize genre
      if genre.save
        render json: { genre: genre_json(genre) }, status: :created
      else
        render json: { errors: genre.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      authorize @genre
      if @genre.update(genre_params)
        render json: { genre: genre_json(@genre) }
      else
        render json: { errors: @genre.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      authorize @genre
      @genre.destroy
      head :no_content
    end

    private

    def set_genre
      @genre = Genre.find(params[:id])
    end

    def genre_params
      params.require(:genre).permit(:name)
    end

    def genre_json(g)
      { id: g.id, name: g.name }
    end
  end
end
