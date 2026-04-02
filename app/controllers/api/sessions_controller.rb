module Api
  class SessionsController < BaseController
    def me
      if current_user
        render json: { user: user_json(current_user) }
      else
        render json: { user: nil }
      end
    end

    def create
      user = User.find_by(email: params.dig(:user, :email)&.downcase)
      if user&.valid_password?(params.dig(:user, :password))
        sign_in(user)
        render json: { user: user_json(user) }
      else
        render json: { error: "Неверный email или пароль" }, status: :unauthorized
      end
    end

    def destroy
      sign_out(current_user) if current_user
      render json: { message: "Выход выполнен" }
    end

    private

    def user_json(u)
      { id: u.id, username: u.username, email: u.email, role: u.role, created_at: u.created_at }
    end
  end
end
