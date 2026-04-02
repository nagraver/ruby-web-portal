module Api
  class BaseController < ApplicationController
    protect_from_forgery with: :exception

    rescue_from ActiveRecord::RecordNotFound do |e|
      render json: { error: "Не найдено" }, status: :not_found
    end

    rescue_from Pundit::NotAuthorizedError do
      render json: { error: "Нет прав для выполнения этого действия" }, status: :forbidden
    end

    rescue_from ActionController::ParameterMissing do |e|
      render json: { error: e.message }, status: :bad_request
    end

    private

    def require_authenticated!
      render json: { error: "Необходимо войти в систему" }, status: :unauthorized unless current_user
    end

    def pagination_meta(collection)
      {
        current_page: collection.current_page,
        total_pages: collection.total_pages,
        total_count: collection.total_count,
        per_page: collection.limit_value
      }
    end
  end
end
