Rails.application.routes.draw do
  get 'responses/create'
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self) rescue ActiveAdmin::DatabaseHitDuringLoad
  devise_for :users
  passwordless_for :users, at: '/', as: :auth
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  get '/app', to: 'home#app'
  namespace :api do
    namespace :v1 do
      resources :emotions, only: %i[index create]
      resources :responses, param: :id
      resources :shoutouts, only: %i[create update]
      resources :fun_question_answers, only: %i[show create update destroy]
      resources :fun_questions, only: %i[show create update destroy]
      get '/response_flow_from_email', to: 'responses#response_flow_from_email'
      get '/all_emotions', to: 'emotions#all_emotions'
      get '/see_results', to: 'responses#see_results'
    end
  end
  get '*path', to: 'home#app'
  get '/*undefined', to: redirect('/')

  root to: 'home#index'
end
