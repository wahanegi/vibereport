Rails.application.routes.draw do
  get 'responses/create'
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  devise_for :users
  passwordless_for :users, at: '/', as: :auth
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  get '/app', to: 'home#app'
  namespace :api do
    namespace :v1 do
      resources :emotions, only: [:index]
      resources :responses, param: :id
      get '/response_flow_from_email', to: 'responses#response_flow_from_email'
      get '/see_the_results', to: 'responses#see_the_results'
    end
  end
  get '*path', to: 'home#app'
  get '/*undefined', to: redirect('/')

  root to: 'home#index'
end
