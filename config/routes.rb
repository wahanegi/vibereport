Rails.application.routes.draw do
  get 'responses/create'
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  devise_for :users
  passwordless_for :users, at: '/', as: :auth
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?

  get '/app', to: 'home#app'
  namespace :api do
    namespace :v1 do
      resources :emotions, only: [:index, :show]
      resources :responses, param: :id
      get '/response_flow_from_email', to: 'responses#response_flow_from_email'
      # post 'emotions', to: 'api/v1/emotions#show'
    end
    end
  get '/results', to: redirect('/app/results')
  get '/emotion_entry', to: redirect('/app/emotion_entry')
  get '*path', to: 'home#app'
  get '/*undefined', to: redirect('/')

  root to:"home#index"
end
