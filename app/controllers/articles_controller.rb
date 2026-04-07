class ArticlesController < ApplicationController
  before_action :authenticate_user!, except: [ :index, :show ]
  before_action :set_article, only: [ :show, :edit, :update, :destroy ]

  def index
    @articles = Article.published.recent.includes(:user, :game)
    @articles = @articles.page(params[:page]).per(10)
  end

  def show
    @comments = @article.comments.includes(:user).order(created_at: :asc).page(params[:page]).per(20)
    @comment = Comment.new
  end

  def new
    @article = current_user.articles.build
    authorize @article
    @games = Game.order(:title)
  end

  def create
    @article = current_user.articles.build(article_params)
    authorize @article
    if @article.save
      redirect_to @article, notice: "Статья успешно создана."
    else
      @games = Game.order(:title)
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    authorize @article
    @games = Game.order(:title)
  end

  def update
    authorize @article
    if @article.update(article_params)
      redirect_to @article, notice: "Статья обновлена."
    else
      @games = Game.order(:title)
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @article
    @article.destroy
    redirect_to articles_path, notice: "Статья удалена."
  end

  private

  def set_article
    @article = Article.find(params[:id])
  end

  def article_params
    params.require(:article).permit(:title, :body, :game_id, :published_at)
  end
end
