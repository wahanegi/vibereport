Rails.application.routes.draw do
  get 'responses/create'
  devise_for :admin_users, ActiveAdmin::Devise.config
  begin
    ActiveAdmin.routes(self)
  rescue StandardError
    ActiveAdmin::DatabaseHitDuringLoad
  end
  devise_for :users, controllers: { sessions: 'devise/passwordless/sessions' }
  devise_scope :user do
    get '/users/magic_link',
        to: 'devise/passwordless/magic_links#show',
        as: 'users_magic_link'
  end

  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  namespace :api do
    namespace :v1 do
      resources :users do
        member do
          post :send_reminder
        end
      end
    end
  end

  get '/app', to: 'home#app'
  get '/sent', to: 'home#sent'
  namespace :api do
    namespace :v1 do
      resources :emotions, only: %i[index create]
      resources :responses, only: %i[create update], param: :id
      resources :fun_question_answers, only: %i[show create update destroy]
      resources :fun_questions, only: %i[show create update destroy]
      resources :results, only: %i[show results_email], param: :slug
      resources :shoutouts, only: %i[show create update destroy]
      resources :notifications, only: %i[create]
      resources :users, only: %i[update]
      resources :emojis, only: %i[create destroy]
      resources :result_managers, controller: 'results', only: %i[show results_email], param: :slug
      get '/response_flow_from_email', to: 'responses#response_flow_from_email'
      get '/all_emotions', to: 'emotions#all_emotions'
      get '/sign_out_user', to: 'responses#sign_out_user'
      get '/sign_in_from_email', to: 'responses#sign_in_from_email'
      get '/results_email', to: 'results#results_email'
      get '/result', to: 'results#show'
      get '/unsubscribe', to: 'users#unsubscribe'
      get '/result_manager', to: 'results#show'
      post '/projects', to: 'projects#sync'
    end
  end

  # Dynamically sets the route for project codes sync based on the ENV key for security
  auth_key = ENV['TIMESHEET_PROJECT_SYNC_AUTH_KEY']

  if auth_key.present?
    post "project_codes/#{auth_key}", to: 'project_codes#sync'
  else
    post 'project_codes', to: 'project_codes#sync'
  end

  get '*path', to: 'home#app', constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }

  root to: 'home#index'
end
