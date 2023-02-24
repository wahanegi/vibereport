Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  devise_for :users
  passwordless_for :users, at: '/', as: :auth
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?


  # Temporary routes
  get '/temporary_blank_page', to: 'home#temporary_sign_in_blank_page_for_test', as: :temporary_blank_page

  get '/app', to: 'home#app', as: :app
  root to:"home#index"
end
