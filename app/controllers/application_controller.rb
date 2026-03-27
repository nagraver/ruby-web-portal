class ApplicationController < ActionController::Base
  include Pundit::Authorization

  before_action :configure_permitted_parameters, if: :devise_controller?

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :username ])
    devise_parameter_sanitizer.permit(:account_update, keys: [ :username ])
  end

  def user_not_authorized
    flash[:alert] = "У вас нет прав для выполнения этого действия."
    redirect_back(fallback_location: root_path)
  end

  def record_not_found
    render file: Rails.root.join("public/404.html"), status: :not_found, layout: false
  end
end
