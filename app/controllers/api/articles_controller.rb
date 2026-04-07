module Api
  class ArticlesController < BaseController
    before_action :require_authenticated!, only: [ :create, :update, :destroy ]
    before_action :set_article, only: [ :show, :update, :destroy ]

    def index
      articles = Article.published.recent.includes(:user, :game)
      articles = articles.page(params[:page]).per(10)

      render json: {
        articles: articles.map { |a| article_json(a) },
        meta: pagination_meta(articles)
      }
    end

    def show
      comments = @article.comments.includes(:user).order(created_at: :asc)

      render json: {
        article: article_detail_json(@article),
        comments: comments.map { |c| comment_json(c) }
      }
    end

    def create
      article = current_user.articles.build(article_params)
      authorize article
      if article.save
        render json: { article: article_json(article) }, status: :created
      else
        render json: { errors: article.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      authorize @article
      if @article.update(article_params)
        render json: { article: article_json(@article) }
      else
        render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      authorize @article
      @article.destroy
      head :no_content
    end

    private

    def set_article
      @article = Article.find(params[:id])
    end

    def article_params
      params.require(:article).permit(:title, :body, :game_id, :published_at)
    end

    def article_json(a)
      {
        id: a.id, title: a.title, body: a.body,
        author: a.user.username, published_at: a.published_at,
        game_id: a.game_id, game_title: a.game&.title,
        likes_count: a.likes.count, comments_count: a.comments.count
      }
    end

    def article_detail_json(a)
      article_json(a).merge(
        liked_by_user: current_user ? a.liked_by?(current_user) : false
      )
    end

    def comment_json(c)
      { id: c.id, body: c.body, user_id: c.user_id, username: c.user.username, created_at: c.created_at }
    end
  end
end
