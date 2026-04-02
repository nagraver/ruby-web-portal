module Api
  module Admin
    class DashboardController < BaseController
      before_action :require_authenticated!
      before_action :require_admin

      def index
        render json: {
          users_count: User.count,
          games_count: Game.count,
          articles_count: Article.count,
          reviews_count: Review.count,
          comments_count: Comment.count,
          likes_count: Like.count,

          recent_users: User.order(created_at: :desc).limit(5).map { |u|
            { id: u.id, username: u.username, role: u.role, created_at: u.created_at }
          },

          recent_reviews: Review.includes(:user, :game).order(created_at: :desc).limit(5).map { |r|
            { id: r.id, title: r.title, rating: r.rating, body: r.body&.truncate(80),
              username: r.user.username, game_id: r.game_id, game_title: r.game.title,
              created_at: r.created_at }
          },

          recent_articles: Article.includes(:user, :game).order(created_at: :desc).limit(5).map { |a|
            { id: a.id, title: a.title, author: a.user.username,
              game_title: a.game&.title, published_at: a.published_at,
              likes_count: a.likes.count, comments_count: a.comments.count }
          },

          top_games: Game.where("average_rating > 0").order(average_rating: :desc).limit(5).map { |g|
            { id: g.id, title: g.title, average_rating: g.average_rating,
              reviews_count: g.reviews.count, developer: g.developer }
          },

          weekly_activity: weekly_activity_data
        }
      end

      private

      def require_admin
        render json: { error: "Доступ запрещён" }, status: :forbidden unless current_user&.admin?
      end

      def weekly_activity_data
        7.downto(0).map do |days_ago|
          date = days_ago.days.ago.to_date
          {
            date: date,
            label: I18n.l(date, format: "%d.%m"),
            reviews: Review.where(created_at: date.all_day).count,
            comments: Comment.where(created_at: date.all_day).count,
            users: User.where(created_at: date.all_day).count
          }
        end
      end
    end
  end
end
