Rails.application.routes.draw do
  devise_for :users, skip: :all

  namespace :api do
    get "home", to: "home#index"

    post "auth/sign_in", to: "sessions#create"
    delete "auth/sign_out", to: "sessions#destroy"
    get "auth/me", to: "sessions#me"
    post "auth/sign_up", to: "registrations#create"
    patch "auth/me", to: "registrations#update"

    resources :games, only: [ :index, :show, :create, :update, :destroy ] do
      resources :reviews, only: [ :create, :update, :destroy ] do
        resources :comments, only: [ :create, :destroy ]
      end
    end

    resources :articles, only: [ :index, :show, :create, :update, :destroy ] do
      resources :comments, only: [ :create, :destroy ]
      post "like", to: "likes#create"
      delete "like", to: "likes#destroy"
    end

    resources :genres, only: [ :index, :show, :create, :update, :destroy ]

    get "profiles/:username", to: "profiles#show"

    namespace :admin do
      get "dashboard", to: "dashboard#index"
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check

  root "home#index"
  get "*path", to: "home#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
