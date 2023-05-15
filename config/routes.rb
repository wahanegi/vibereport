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
      resources :emotions, only: %i[index create]
      resources :responses, only: %i[create update], param: :id
      resources :fun_question_answers, only: %i[show create update destroy]
      resources :fun_questions, only: %i[show create update destroy]
      resources :results, only: %i[show results_email]
      resources :shoutouts, only: %i[create update]
      get '/response_flow_from_email', to: 'responses#response_flow_from_email'
      get '/all_emotions', to: 'emotions#all_emotions'
      get '/results_email', to: 'results#results_email'
      get '/result', to: 'results#show'
    end
  end
  get '*path', to: 'home#app'
  get '/*undefined', to: redirect('/')

  root to: 'home#index'
end
