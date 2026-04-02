module Api
  class GamesController < BaseController
    before_action :require_authenticated!, only: [ :create, :update, :destroy ]
    before_action :set_game, only: [ :show, :update, :destroy ]

    def index
      games = Game.includes(:genres)
      games = games.by_genre(params[:genre_id]) if params[:genre_id].present?
      games = games.where("title ILIKE ?", "%#{params[:q]}%") if params[:q].present?

      per = (params[:per_page] || 12).to_i
      games = games.order(created_at: :desc).page(params[:page]).per(per)
      genres = Genre.sorted

      render json: {
        games: games.map { |g| game_json(g) },
        genres: genres.map { |ge| { id: ge.id, name: ge.name } },
        meta: pagination_meta(games)
      }
    end

    def show
      reviews = @game.reviews.includes(:user, comments: :user).order(created_at: :desc).page(params[:page]).per(10)

      render json: {
        game: game_detail_json(@game),
        reviews: reviews.map { |r| review_json(r) },
        meta: pagination_meta(reviews)
      }
    end

    def create
      game = Game.new(game_params)
      authorize game
      if game.save
        render json: { game: game_json(game) }, status: :created
      else
        render json: { errors: game.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      authorize @game
      if @game.update(game_params)
        render json: { game: game_json(@game) }
      else
        render json: { errors: @game.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      authorize @game
      @game.destroy
      head :no_content
    end

    private

    def set_game
      @game = Game.find(params[:id])
    end

    def game_params
      params.require(:game).permit(:title, :description, :developer, :publisher,
                                   :release_date, :cover_image, genre_ids: [])
    end

    def game_json(g)
      {
        id: g.id, title: g.title, average_rating: g.average_rating,
        developer: g.developer, publisher: g.publisher,
        genres: g.genres.map { |ge| { id: ge.id, name: ge.name } }
      }
    end

    def game_detail_json(g)
      {
        id: g.id, title: g.title, description: g.description,
        developer: g.developer, publisher: g.publisher,
        release_date: g.release_date, cover_image: g.cover_image,
        average_rating: g.average_rating,
        reviews_count: g.reviews.count,
        genres: g.genres.map { |ge| { id: ge.id, name: ge.name } }
      }
    end

    def review_json(r)
      {
        id: r.id, title: r.title, body: r.body, rating: r.rating,
        user_id: r.user_id, username: r.user.username,
        created_at: r.created_at,
        comments: r.comments.recent.map { |c|
          { id: c.id, body: c.body, user_id: c.user_id, username: c.user.username, created_at: c.created_at }
        }
      }
    end
  end
end
