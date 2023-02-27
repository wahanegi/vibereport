Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  devise_for :users
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?  
  get '/app', to: 'home#app', as: :app
  get '/*undefined', to: redirect('/')

  root to:"home#index"
end
