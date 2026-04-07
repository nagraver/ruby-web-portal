module Api
  class HomeController < BaseController
    def index
      latest_articles = Article.published.recent.includes(:user, :game).limit(6)
      top_games = Game.top_rated.includes(:genres).limit(6)
      recent_games = Game.recent.includes(:genres).limit(6)

      render json: {
        latest_articles: latest_articles.map { |a| article_summary(a) },
        top_games: top_games.map { |g| game_summary(g) },
        recent_games: recent_games.map { |g| game_summary(g) }
      }
    end

    private

    def article_summary(a)
      {
        id: a.id, title: a.title, body: a.body,
        author: a.user.username, published_at: a.published_at,
        game_title: a.game&.title
      }
    end

    def game_summary(g)
      {
        id: g.id, title: g.title, average_rating: g.average_rating,
        genres: g.genres.map { |ge| { id: ge.id, name: ge.name } }
      }
    end
  end
end
