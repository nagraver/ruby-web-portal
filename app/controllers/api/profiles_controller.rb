module Api
  class ProfilesController < BaseController
    def show
      user = User.find_by!(username: params[:username])
      reviews = user.reviews.includes(:game).recent.limit(5)
      comments = user.comments.order(created_at: :desc).limit(10)

      data = {
        user: { id: user.id, username: user.username, role: user.role, created_at: user.created_at },
        stats: {
          reviews_count: user.reviews.count,
          comments_count: user.comments.count
        },
        recent_reviews: reviews.map { |r|
          { id: r.id, title: r.title, rating: r.rating, game_id: r.game_id, game_title: r.game.title, created_at: r.created_at }
        }
      }

      if user.admin?
        articles = user.articles.published.recent.limit(5)
        data[:stats][:articles_count] = user.articles.count
        data[:recent_articles] = articles.map { |a|
          { id: a.id, title: a.title, published_at: a.published_at }
        }
      end

      render json: data
    end
  end
end
