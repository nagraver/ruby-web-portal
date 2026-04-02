module Api
  class RegistrationsController < BaseController
    before_action :require_authenticated!, only: [ :update ]

    def create
      user = User.new(sign_up_params)
      if user.save
        sign_in(user)
        render json: { user: user_json(user) }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      user = current_user

      if user.valid_password?(params.dig(:user, :current_password))
        update_params = account_update_params
        update_params.delete(:current_password)
        update_params.reject! { |_, v| v.blank? } if update_params[:password].blank?

        if user.update(update_params)
          bypass_sign_in(user)
          render json: { user: user_json(user) }
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { errors: [ "Текущий пароль неверен" ] }, status: :unprocessable_entity
      end
    end

    private

    def sign_up_params
      params.require(:user).permit(:username, :email, :password, :password_confirmation)
    end

    def account_update_params
      params.require(:user).permit(:username, :email, :password, :password_confirmation, :current_password)
    end

    def user_json(u)
      { id: u.id, username: u.username, email: u.email, role: u.role, created_at: u.created_at }
    end
  end
end
